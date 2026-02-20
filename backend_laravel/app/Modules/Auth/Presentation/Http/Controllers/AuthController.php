<?php

// Controller principal de Auth
// Maneja todas las peticiones HTTP de autenticación:
// - POST /login      → Login con email + password + deviceId
// - POST /refresh    → Renovar tokens usando el refresh token de la cookie
// - POST /logout     → Cerrar sesión actual (1 dispositivo)
// - POST /logout-all → Cerrar sesión en TODOS los dispositivos
// - POST /logout-device → Cerrar sesión de un dispositivo específico
// - GET  /sessions   → Listar todas las sesiones activas del usuario
// - GET  /me         → Obtener datos del usuario autenticado

namespace App\Modules\Auth\Presentation\Http\Controllers;

use App\Modules\Auth\Application\Commands\LoginCommand;
use App\Modules\Auth\Application\Commands\RefreshTokenCommand;
use App\Modules\Auth\Application\Commands\LogoutCommand;
use App\Modules\Auth\Application\Commands\LogoutAllCommand;
use App\Modules\Auth\Application\Commands\LogoutDeviceCommand;
use App\Modules\Auth\Application\Queries\GetActiveSessionsQuery;
use App\Modules\Auth\Presentation\Http\Requests\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function __construct(
        private LoginCommand $loginCommand,
        private RefreshTokenCommand $refreshCommand,
        private LogoutCommand $logoutCommand,
        private LogoutAllCommand $logoutAllCommand,
        private LogoutDeviceCommand $logoutDeviceCommand,
        private GetActiveSessionsQuery $getSessionsQuery,
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->loginCommand->execute(
                email: $request->input('email'),
                password: $request->input('password'),
                deviceId: $request->input('deviceId'),
                deviceType: $request->input('deviceType'),
                browser: $request->input('browser'),
                os: $request->input('os'),
            );

            return response()
                ->json([
                    'access_token' => $result['access_token'],
                    'token_type' => $result['token_type'],
                    'expires_in' => $result['expires_in'],
                    'user' => $result['user'],
                ])
                ->cookie(
                    'refresh_token',              // Nombre de la cookie
                    $result['refresh_token'],     // Valor (el JWT)
                    60 * 24 * 7,                  // Duración: 7 días en minutos
                    '/api/auth',               // Path: solo se envía a rutas de auth
                    null,                         // Domain
                    false,                        // Secure (true en producción con HTTPS)
                    true,                         // httpOnly: no accesible desde JavaScript
                    false,                        // Raw
                    'Lax'                         // SameSite
                );
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 401);
        }
    }

    public function refresh(Request $request): JsonResponse
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return response()->json(['error' => 'No refresh token proporcionado'], 401);
        }

        try {
            $result = $this->refreshCommand->execute($refreshToken);

            return response()
                ->json([
                    'access_token' => $result['access_token'],
                    'token_type' => $result['token_type'],
                    'expires_in' => $result['expires_in'],
                ])
                ->cookie(
                    'refresh_token',
                    $result['refresh_token'],
                    60 * 24 * 7,
                    '/api/v1/auth',
                    null,
                    false,
                    true,
                    false,
                    'Lax'
                );
        } catch (\Exception $e) {
            return response()
                ->json(['error' => $e->getMessage()], 401)
                ->withoutCookie('refresh_token', '/api/auth');
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $refreshToken = $request->cookie('refresh_token');

        $this->logoutCommand->execute($refreshToken);

        return response()
            ->json(['message' => 'Sesión cerrada correctamente'])
            ->withoutCookie('refresh_token', '/api/v1/auth');
    }

    public function logoutAll(Request $request): JsonResponse
    {
        $userId = JWTAuth::parseToken()->getPayload()->get('sub');

        $this->logoutAllCommand->execute($userId);

        return response()
            ->json(['message' => 'Todas las sesiones cerradas correctamente'])
            ->withoutCookie('refresh_token', '/api/v1/auth');
    }

    public function logoutDevice(Request $request): JsonResponse
    {
        $request->validate([
            'deviceId' => 'required|string',
        ]);

        $userId = JWTAuth::parseToken()->getPayload()->get('sub');
        $deviceId = $request->input('deviceId');

        $this->logoutDeviceCommand->execute($userId, $deviceId);

        return response()->json(['message' => 'Sesión del dispositivo cerrada correctamente']);
    }

    public function sessions(): JsonResponse
    {
        $userId = JWTAuth::parseToken()->getPayload()->get('sub');

        $sessions = $this->getSessionsQuery->execute($userId);

        $formatted = array_map(function ($session) {
            return [
                'id' => $session->id,
                'device_id' => $session->device_id,
                'device_type' => $session->device_type,
                'browser' => $session->browser,
                'os' => $session->os,
                'last_used_at' => $session->last_used_at,
                'created_at' => $session->createdAt,
            ];
        }, $sessions);

        return response()->json(['sessions' => $formatted]);
    }

    public function me(): JsonResponse
    {
        $userId = JWTAuth::parseToken()->getPayload()->get('sub');

        $user = app(\App\Modules\Auth\Infrastructure\Persistence\Eloquent\Repositories\EloquentAuthRepository::class)
            ->findUserById($userId);

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        return response()->json(['user' => $user]);
    }
}
