<?php

namespace App\Modules\Auth\Infrastructure\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $payload = JWTAuth::parseToken()->getPayload();

            $request->merge(['auth_user_id' => $payload->get('sub')]);
        } catch (TokenExpiredException $e) {
            return response()->json([
                'error' => 'Token expirado',
                'code' => 'TOKEN_EXPIRED',
            ], 401);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'error' => 'Token inválido',
                'code' => 'TOKEN_INVALID',
            ], 401);
        } catch (JWTException $e) {
            return response()->json([
                'error' => 'Token no proporcionado',
                'code' => 'TOKEN_MISSING',
            ], 401);
        }

        return $next($request);
    }
}
