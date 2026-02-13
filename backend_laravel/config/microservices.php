<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Gateway Mode
    |--------------------------------------------------------------------------
    |
    | When enabled, the ApiGateway middleware will proxy requests to external
    | microservices. When disabled, requests pass through to local controllers
    | (monolith mode) and only response formatting is applied.
    |
    */
    'gateway_enabled' => env('GATEWAY_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | Service Registry
    |--------------------------------------------------------------------------
    |
    | Each service defines the URL prefix(es) it handles, its base URL,
    | timeout and retry configuration. The gateway uses this to route
    | incoming requests to the correct downstream microservice.
    |
    */
    'services' => [

        'user' => [
            'name'      => 'User Service',
            'base_url'  => env('SERVICE_USER_URL', 'http://localhost:8001'),
            'prefixes'  => ['usuaris'],
            'timeout'   => env('SERVICE_USER_TIMEOUT', 10),
            'retries'   => env('SERVICE_USER_RETRIES', 2),
        ],

        'club' => [
            'name'      => 'Club Service',
            'base_url'  => env('SERVICE_CLUB_URL', 'http://localhost:8002'),
            'prefixes'  => ['clubs'],
            'timeout'   => env('SERVICE_CLUB_TIMEOUT', 10),
            'retries'   => env('SERVICE_CLUB_RETRIES', 2),
        ],

        'league' => [
            'name'      => 'League Service',
            'base_url'  => env('SERVICE_LEAGUE_URL', 'http://localhost:8003'),
            'prefixes'  => ['lligues', 'jornades', 'classificacions'],
            'timeout'   => env('SERVICE_LEAGUE_TIMEOUT', 10),
            'retries'   => env('SERVICE_LEAGUE_RETRIES', 2),
        ],

        'match' => [
            'name'      => 'Match Service',
            'base_url'  => env('SERVICE_MATCH_URL', 'http://localhost:8004'),
            'prefixes'  => ['partits'],
            'timeout'   => env('SERVICE_MATCH_TIMEOUT', 10),
            'retries'   => env('SERVICE_MATCH_RETRIES', 2),
        ],

        // Servei de Venues: gestiona instal·lacions i pistes esportives (port 8005)
        'venue' => [
            'name'      => 'Venue Service',
            'base_url'  => env('SERVICE_VENUE_URL', 'http://localhost:8005'),
            'prefixes'  => ['instalacions'],
            'timeout'   => env('SERVICE_VENUE_TIMEOUT', 10),
            'retries'   => env('SERVICE_VENUE_RETRIES', 2),
        ],

        // Servei de Lineup: gestiona alineacions de jugadors en partits (port 8006)
        'lineup' => [
            'name'      => 'Lineup Service',
            'base_url'  => env('SERVICE_LINEUP_URL', 'http://localhost:8006'),
            'prefixes'  => ['alineacions'],
            'timeout'   => env('SERVICE_LINEUP_TIMEOUT', 10),
            'retries'   => env('SERVICE_LINEUP_RETRIES', 2),
        ],

        'invitation' => [
            'name'      => 'Invitation Service',
            'base_url'  => env('SERVICE_INVITATION_URL', 'http://localhost:8007'),
            'prefixes'  => ['invitacions'],
            'timeout'   => env('SERVICE_INVITATION_TIMEOUT', 10),
            'retries'   => env('SERVICE_INVITATION_RETRIES', 2),
        ],

        'merchandise' => [
            'name'      => 'Merchandise Service',
            'base_url'  => env('SERVICE_MERCHANDISE_URL', 'http://localhost:8008'),
            'prefixes'  => ['merchs', 'compras'],
            'timeout'   => env('SERVICE_MERCHANDISE_TIMEOUT', 10),
            'retries'   => env('SERVICE_MERCHANDISE_RETRIES', 2),
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Global Gateway Settings
    |--------------------------------------------------------------------------
    */
    'global_timeout'   => env('GATEWAY_TIMEOUT', 30),
    'retry_delay_ms'   => env('GATEWAY_RETRY_DELAY', 200),

    /*
    |--------------------------------------------------------------------------
    | Circuit Breaker
    |--------------------------------------------------------------------------
    |
    | After `threshold` consecutive failures within a service, the circuit
    | opens and all requests to that service are immediately rejected for
    | `cooldown_seconds`. This protects the gateway from cascading failures.
    |
    */
    'circuit_breaker' => [
        'enabled'          => env('CIRCUIT_BREAKER_ENABLED', true),
        'threshold'        => env('CIRCUIT_BREAKER_THRESHOLD', 5),
        'cooldown_seconds' => env('CIRCUIT_BREAKER_COOLDOWN', 30),
    ],

    /*
    |--------------------------------------------------------------------------
    | Logging
    |--------------------------------------------------------------------------
    */
    'log_requests'  => env('GATEWAY_LOG_REQUESTS', true),
    'log_channel'   => env('GATEWAY_LOG_CHANNEL', 'stack'),

];
