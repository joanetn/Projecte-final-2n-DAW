<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

/**
 * Administration endpoints for the API Gateway.
 *
 * These routes are NOT proxied — they are served directly by the gateway
 * regardless of whether gateway mode is on or off.
 */
class GatewayController extends Controller
{
    /**
     * GET /api/gateway/health
     * Quick liveness check for the gateway itself.
     */
    public function health(): JsonResponse
    {
        return response()->json([
            'status'           => 'ok',
            'gateway_enabled'  => config('microservices.gateway_enabled'),
            'timestamp'        => now()->toIso8601String(),
        ]);
    }

    /**
     * GET /api/gateway/services
     * List registered services with their current circuit-breaker state.
     */
    public function services(): JsonResponse
    {
        $services = [];

        foreach (config('microservices.services', []) as $key => $svc) {
            $failures  = (int) Cache::get("gateway:cb:{$key}:failures", 0);
            $threshold = config('microservices.circuit_breaker.threshold', 5);

            $services[$key] = [
                'name'            => $svc['name'] ?? $key,
                'base_url'        => $svc['base_url'],
                'prefixes'        => $svc['prefixes'] ?? [],
                'timeout'         => $svc['timeout'] ?? config('microservices.global_timeout'),
                'retries'         => $svc['retries'] ?? 2,
                'circuit_breaker' => [
                    'failures'  => $failures,
                    'threshold' => $threshold,
                    'state'     => $failures >= $threshold ? 'OPEN' : 'CLOSED',
                ],
            ];
        }

        return response()->json([
            'success'  => true,
            'data'     => $services,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * GET /api/gateway/services/{serviceKey}/health
     * Active health-check: pings the downstream service and reports.
     */
    public function serviceHealth(string $serviceKey): JsonResponse
    {
        $svc = config("microservices.services.{$serviceKey}");

        if (!$svc) {
            return response()->json([
                'success' => false,
                'error'   => "Service [{$serviceKey}] not found in registry.",
            ], 404);
        }

        $url     = rtrim($svc['base_url'], '/') . '/api/gateway/health';
        $timeout = $svc['timeout'] ?? 5;

        try {
            $start = microtime(true);

            /** @var \Illuminate\Http\Client\Response $response */
            $response = Http::timeout($timeout)->get($url);
            $elapsed  = round((microtime(true) - $start) * 1000, 2);

            return response()->json([
                'success'    => $response->successful(),
                'service'    => $serviceKey,
                'status'     => $response->status(),
                'latency_ms' => $elapsed,
                'body'       => $response->json(),
                'timestamp'  => now()->toIso8601String(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success'   => false,
                'service'   => $serviceKey,
                'error'     => $e->getMessage(),
                'timestamp' => now()->toIso8601String(),
            ], 503);
        }
    }

    /**
     * POST /api/gateway/services/{serviceKey}/circuit-reset
     * Manually reset the circuit breaker for a service.
     */
    public function resetCircuit(string $serviceKey): JsonResponse
    {
        $svc = config("microservices.services.{$serviceKey}");

        if (!$svc) {
            return response()->json([
                'success' => false,
                'error'   => "Service [{$serviceKey}] not found in registry.",
            ], 404);
        }

        Cache::forget("gateway:cb:{$serviceKey}:failures");

        return response()->json([
            'success'   => true,
            'message'   => "Circuit breaker for [{$serviceKey}] has been reset.",
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
