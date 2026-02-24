<?php

namespace App\Modules\Auth\Infrastructure\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ValidateSessionMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $payload = JWTAuth::parseToken()->getPayload();
            $familyId = $payload->get('familyId');

            if (!$familyId) {
                return response()->json([
                    'error' => 'Token no tiene sesión asociada',
                    'code' => 'NO_SESSION',
                ], 401);
            }

            $authRepo = app(\App\Modules\Auth\Infrastructure\Persistence\Eloquent\Repositories\EloquentAuthRepository::class);
            $session = $authRepo->findRefreshSessionByFamilyId($familyId);

            if (!$session || $session->isRevoked()) {
                return response()->json([
                    'error' => 'Sesión revocada. Por favor inicia sesión nuevamente.',
                    'code' => 'SESSION_REVOKED',
                ], 401);
            }

            return $next($request);
        } catch (\Exception $e) {
            return $next($request);
        }
    }
}
