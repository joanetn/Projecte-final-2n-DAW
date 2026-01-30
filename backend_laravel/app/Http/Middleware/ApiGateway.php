<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ApiGateway
{
    /**
     * Middleware de API Gateway.
     * Punto de entrada centralizado para todas las peticiones a la API.
     * Normaliza todas las respuestas JSON.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Procesa la petición a través de la aplicación
        $response = $next($request);

        // Si es una respuesta JSON, la normaliza
        if ($response instanceof JsonResponse) {
            return $this->formatResponse($response);
        }

        return $response;
    }

    /**
     * Formatea la respuesta JSON de forma centralizada
     */
    private function formatResponse(JsonResponse $response): JsonResponse
    {
        $data = $response->getData(true);

        // Si ya tiene estructura "success", no modificar
        if (isset($data['success'])) {
            return $response;
        }

        // Si es un error de validación o similar
        if (isset($data['message']) && isset($data['errors'])) {
            return $response;
        }

        // Normalizar respuesta
        $formatted = [
            'success' => $response->getStatusCode() >= 200 && $response->getStatusCode() < 300,
            'data' => $data,
            'timestamp' => now()->toIso8601String(),
        ];

        return response()->json($formatted, $response->getStatusCode());
    }
}
