<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ApiGateway
{
    /**
     * Real API Gateway middleware.
     *
     * When GATEWAY_ENABLED=true  →  proxies every request to the downstream
     *                                microservice resolved from the URL prefix.
     * When GATEWAY_ENABLED=false →  pass-through to local controllers (monolith)
     *                                with response normalisation only.
     */

    // ─── In-memory prefix → service map (built once per request lifecycle) ───
    private ?array $prefixMap = null;

    /* ====================================================================
     |  MAIN HANDLE
     | ==================================================================*/

    public function handle(Request $request, Closure $next): Response
    {
        // Assign a unique request-id for tracing across services
        $requestId = $request->header('X-Request-ID', (string) Str::uuid());
        $request->headers->set('X-Request-ID', $requestId);

        // ── Gateway admin endpoints: always local, never proxy ──
        if ($this->isGatewayAdminRoute($request)) {
            $response = $next($request);
            if ($response instanceof JsonResponse) {
                $response->headers->set('X-Request-ID', $requestId);
            }
            return $response;
        }

        // ── Gateway mode: proxy to microservice ──
        if (config('microservices.gateway_enabled')) {
            return $this->proxy($request, $requestId);
        }

        // ── Monolith / local mode: pass-through + normalise response ──
        $response = $next($request);

        if ($response instanceof JsonResponse) {
            $response = $this->formatResponse($response);
        }

        $response->headers->set('X-Request-ID', $requestId);

        return $response;
    }

    /* ====================================================================
     |  ROUTE DETECTION
     | ==================================================================*/

    /**
     * Check if this request is for a gateway admin endpoint.
     * These are always processed locally, never proxied.
     */
    private function isGatewayAdminRoute(Request $request): bool
    {
        $path = ltrim($request->path(), '/');

        if (str_starts_with($path, 'api/')) {
            $path = substr($path, 4);
        }

        return str_starts_with($path, 'gateway/') || str_starts_with($path, 'admin/');
    }
    private function buildPrefixMap(): array
    {
        if ($this->prefixMap !== null) {
            return $this->prefixMap;
        }

        $this->prefixMap = [];

        foreach (config('microservices.services', []) as $key => $svc) {
            foreach ($svc['prefixes'] ?? [] as $prefix) {
                $this->prefixMap[$prefix] = array_merge($svc, ['key' => $key]);
            }
        }

        return $this->prefixMap;
    }

    /**
     * Resolve which service should handle the given request.
     * Returns null when no match is found.
     */
    private function resolveService(Request $request): ?array
    {
        $map  = $this->buildPrefixMap();
        // The first segment after /api/  e.g.  /api/usuaris/3 → "usuaris"
        $path = ltrim($request->path(), '/');

        // Strip the leading "api/" prefix if present
        if (str_starts_with($path, 'api/')) {
            $path = substr($path, 4);
        }

        $firstSegment = explode('/', $path)[0] ?? '';

        return $map[$firstSegment] ?? null;
    }

    /* ====================================================================
     |  CIRCUIT BREAKER
     | ==================================================================*/

    private function circuitIsOpen(string $serviceKey): bool
    {
        if (!config('microservices.circuit_breaker.enabled', true)) {
            return false;
        }

        $failures  = (int) Cache::get("gateway:cb:{$serviceKey}:failures", 0);
        $threshold = config('microservices.circuit_breaker.threshold', 5);

        return $failures >= $threshold;
    }

    private function recordFailure(string $serviceKey): void
    {
        $cacheKey = "gateway:cb:{$serviceKey}:failures";
        $cooldown = config('microservices.circuit_breaker.cooldown_seconds', 30);

        $current = (int) Cache::get($cacheKey, 0);
        Cache::put($cacheKey, $current + 1, now()->addSeconds($cooldown));
    }

    private function resetCircuit(string $serviceKey): void
    {
        Cache::forget("gateway:cb:{$serviceKey}:failures");
    }

    /* ====================================================================
     |  HTTP PROXY
     | ==================================================================*/

    /**
     * Forward the incoming request to the resolved microservice.
     */
    private function proxy(Request $request, string $requestId): JsonResponse
    {
        $started = microtime(true);
        $service = $this->resolveService($request);

        // ── No matching service ──
        if ($service === null) {
            return $this->gatewayError(
                'No service registered for this route.',
                404,
                $requestId
            );
        }

        $serviceKey = $service['key'];

        // ── Circuit breaker open? ──
        if ($this->circuitIsOpen($serviceKey)) {
            $this->logGateway('warning', "Circuit OPEN for [{$serviceKey}]", $request, $requestId);

            return $this->gatewayError(
                "Service [{$service['name']}] is temporarily unavailable (circuit open).",
                503,
                $requestId
            );
        }

        // ── Build the downstream URL ──
        $downstreamPath = $this->buildDownstreamPath($request);
        $fullBaseUrl    = rtrim($service['base_url'], '/') . '/api/' . $downstreamPath;

        // ── Forward headers ──
        $headers = $this->forwardHeaders($request, $requestId);

        // ── Retry loop ──
        $maxRetries = $service['retries'] ?? 2;
        $timeout    = $service['timeout'] ?? config('microservices.global_timeout', 30);
        $retryDelay = config('microservices.retry_delay_ms', 200);
        $lastException = null;

        for ($attempt = 0; $attempt <= $maxRetries; $attempt++) {
            if ($attempt > 0) {
                usleep($retryDelay * 1000 * $attempt);
                $this->logGateway('info', "Retry #{$attempt} to [{$serviceKey}]", $request, $requestId);
            }

            try {
                $targetUrl = $fullBaseUrl . ($request->getQueryString() ? '?' . $request->getQueryString() : '');

                $downstreamResponse = Http::withHeaders($headers)
                    ->timeout($timeout)
                    ->withBody(
                        $request->getContent(),
                        $request->header('Content-Type', 'application/json')
                    )
                    ->send($request->method(), $targetUrl);

                // Success → reset circuit, build response
                $this->resetCircuit($serviceKey);

                $elapsed = round((microtime(true) - $started) * 1000, 2);
                $statusCode = $downstreamResponse->status();
                $this->logGateway('info', "→ [{$serviceKey}] {$request->method()} {$targetUrl} — {$statusCode} ({$elapsed} ms)", $request, $requestId);

                return $this->buildProxyResponse($downstreamResponse, $requestId, $serviceKey, $elapsed);
            } catch (\Illuminate\Http\Client\ConnectionException $e) {
                $lastException = $e;
                $this->recordFailure($serviceKey);
                $this->logGateway('error', "Connection failed to [{$serviceKey}]: {$e->getMessage()}", $request, $requestId);
            } catch (\Exception $e) {
                $lastException = $e;
                $this->recordFailure($serviceKey);
                $this->logGateway('error', "Error proxying to [{$serviceKey}]: {$e->getMessage()}", $request, $requestId);
                break;
            }
        }

        // All retries exhausted
        return $this->gatewayError(
            "Service [{$service['name']}] is unreachable: " . ($lastException?->getMessage() ?? 'unknown error'),
            502,
            $requestId
        );
    }

    /**
     * Build the relative downstream path from the current request.
     * Strips the leading /api/ prefix so each service receives its own
     * local path, e.g.  /api/usuaris/5 → usuaris/5
     */
    private function buildDownstreamPath(Request $request): string
    {
        $path = ltrim($request->path(), '/');

        if (str_starts_with($path, 'api/')) {
            $path = substr($path, 4);
        }

        return $path;
    }

    /**
     * Select which headers to forward downstream.
     */
    private function forwardHeaders(Request $request, string $requestId): array
    {
        $forward = [
            'X-Request-ID'    => $requestId,
            'X-Forwarded-For' => $request->ip(),
            'Accept'          => $request->header('Accept', 'application/json'),
            'Content-Type'    => $request->header('Content-Type', 'application/json'),
            'X-Gateway'       => 'laravel-api-gateway/1.0',
        ];

        // Forward Authorization transparently
        if ($auth = $request->header('Authorization')) {
            $forward['Authorization'] = $auth;
        }

        // Forward Accept-Language
        if ($lang = $request->header('Accept-Language')) {
            $forward['Accept-Language'] = $lang;
        }

        return $forward;
    }

    /**
     * Wrap the downstream HTTP response into a Laravel JsonResponse.
     */
    private function buildProxyResponse(
        \Illuminate\Http\Client\Response $downstream,
        string $requestId,
        string $serviceKey,
        float $elapsedMs
    ): JsonResponse {
        $body = $downstream->json() ?? $downstream->body();
        $statusCode = $downstream->status();

        // If downstream already wraps in our format, pass through as-is
        if (is_array($body) && isset($body['success'])) {
            $data = $body;
        } else {
            $data = [
                'success'   => $statusCode >= 200 && $statusCode < 300,
                'data'      => $body,
                'timestamp' => now()->toIso8601String(),
            ];
        }

        $data['_gateway'] = [
            'service'    => $serviceKey,
            'request_id' => $requestId,
            'latency_ms' => $elapsedMs,
        ];

        return response()->json($data, $statusCode)
            ->withHeaders([
                'X-Request-ID'      => $requestId,
                'X-Gateway-Service' => $serviceKey,
                'X-Gateway-Latency' => "{$elapsedMs}ms",
            ]);
    }

    /* ====================================================================
     |  ERROR HELPERS
     | ==================================================================*/

    private function gatewayError(string $message, int $status, string $requestId): JsonResponse
    {
        return response()->json([
            'success'   => false,
            'error'     => $message,
            'timestamp' => now()->toIso8601String(),
            '_gateway'  => [
                'request_id' => $requestId,
            ],
        ], $status)->withHeaders([
            'X-Request-ID' => $requestId,
        ]);
    }

    /* ====================================================================
     |  RESPONSE FORMAT (monolith / local mode)
     | ==================================================================*/

    private function formatResponse(JsonResponse $response): JsonResponse
    {
        $data = $response->getData(true);

        // Already normalized
        if (isset($data['success'])) {
            return $response;
        }

        // Validation error envelope — leave untouched
        if (isset($data['message'], $data['errors'])) {
            return $response;
        }

        $formatted = [
            'success'   => $response->getStatusCode() >= 200 && $response->getStatusCode() < 300,
            'data'      => $data,
            'timestamp' => now()->toIso8601String(),
        ];

        return response()->json($formatted, $response->getStatusCode());
    }

    /* ====================================================================
     |  LOGGING
     | ==================================================================*/

    private function logGateway(string $level, string $message, Request $request, string $requestId): void
    {
        if (!config('microservices.log_requests', true)) {
            return;
        }

        $channel = config('microservices.log_channel', 'stack');

        Log::channel($channel)->{$level}("[API-GW] [{$requestId}] {$message}", [
            'method' => $request->method(),
            'url'    => $request->fullUrl(),
            'ip'     => $request->ip(),
        ]);
    }
}
