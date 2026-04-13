<?php

namespace App\Services\IA;

use Illuminate\Support\Facades\Http;

class GeminiService
{
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

    public function chat(array $messages): string
    {
        $prompt = $messages[count($messages) - 1]['content'] ?? '';

        if ($prompt === '') {
            throw new \Exception('No hay mensaje para enviar a Gemini');
        }

        $endpoint = $this->baseUrl . '/models/gemini-2.5-flash:generateContent?key=' . config('services.gemini.api_key');
        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post($endpoint, [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt],
                    ],
                ],
            ],
        ]);

        if (!$response->successful()) {
            throw new \Exception('Error en Gemini: ' . $response->body());
        }

        $data = $response->json();

        if (!isset($data['candidates'][0]['content']['parts'][0]['text'])) {
            throw new \Exception('Respuesta inesperada de Gemini: ' . json_encode($data));
        }

        return $data['candidates'][0]['content']['parts'][0]['text'];
    }

    public function stream(array $messages)
    {
        return response()->stream(function () use ($messages) {
            echo $this->chat($messages);
            ob_flush();
            flush();
        }, 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
