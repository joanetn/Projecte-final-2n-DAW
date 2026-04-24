<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'pusher' => [
        'key' => env('PUSHER_APP_KEY'),
        'secret' => env('PUSHER_APP_SECRET'),
        'app_id' => env('PUSHER_APP_ID'),
        'options' => [
            'cluster' => env('PUSHER_APP_CLUSTER'),
            'host' => env('PUSHER_HOST', '127.0.0.1'),
            'port' => env('PUSHER_PORT', 6001),
            'scheme' => env('PUSHER_SCHEME', 'http'),
            'useTLS' => env('PUSHER_SCHEME', 'http') === 'https',
            'encrypted' => env('PUSHER_APP_ENCRYPTED', false),
        ],
    ],

    'stripe' => [
        'secret' => env('STRIPE_SECRET_KEY'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    'cerebras' => [
        'api_key' => env('CEREBRAS_API_KEY'),
    ],

    'groq' => [
        'api_key' => env('GROQ_API_KEY'),
    ],

    'open_router' => [
        'api_key' => env('OPENROUTER_API_KEY'),
    ],

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
    ],

    'mistral' => [
        'api_key' => env('MISTRAL_API_KEY'),
    ],

    'cohere' => [
        'api_key' => env('COHERE_API_KEY'),
    ],

    'sms_twilio' => [
        'enabled' => env('SMS_TWILIO_ENABLED', false),
        'channel' => env('SMS_TWILIO_CHANNEL', 'sms'),
        'base_url' => env('SMS_TWILIO_BASE_URL', 'https://api.twilio.com'),
        'account_sid' => env('SMS_TWILIO_ACCOUNT_SID'),
        'auth_token' => env('SMS_TWILIO_AUTH_TOKEN'),
        'from_number' => env('SMS_TWILIO_FROM_NUMBER'),
        'messaging_service_sid' => env('SMS_TWILIO_MESSAGING_SERVICE_SID'),
        'default_country_code' => env('SMS_DEFAULT_COUNTRY_CODE', '34'),
        'fallback_recipient' => env('NOTIFICATIONS_SMS_RECIPIENT'),
        'timeout' => env('SMS_TIMEOUT', 15),
        'retries' => env('SMS_RETRIES', 1),
        'retry_sleep_ms' => env('SMS_RETRY_SLEEP_MS', 200),
    ],

];
