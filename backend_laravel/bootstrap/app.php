<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        apiPrefix: 'api'
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \App\Http\Middleware\ApiGateway::class,
        ]);

        $middleware->alias([
            'jwt.auth' => \App\Modules\Auth\Infrastructure\Middleware\JwtMiddleware::class,
            'validate.session' => \App\Modules\Auth\Infrastructure\Middleware\ValidateSessionMiddleware::class,
            'checkRole' => \App\Http\Middleware\CheckRole::class,
            'checkPermission' => \App\Http\Middleware\CheckPermission::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
