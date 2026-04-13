<?php

namespace App\Services\IA;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Http;

class OpenRouterService
{
    protected string $baseUrl = 'https://openrouter.ai/api/v1';

    public function chat(array $messages): string
    {
        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.open_router.api_key'),
            'Content-Type' => 'application/json',
        ])->post($this->baseUrl . '/chat/completions', [
            'model' => 'mistralai/mistral-7b-instruct:free',
            'messages' => $messages,
        ]);

        if (!$response->successful()) {
            throw new \Exception('Error en OpenRouter: ' . $response->body());
        }

        $data = $response->json();

        if (!isset($data['choices'][0]['message']['content'])) {
            throw new \Exception('Respuesta inesperada de OpenRouter: ' . json_encode($data));
        }

        return $data['choices'][0]['message']['content'];
    }

    public function stream(array $messages)
    {
        return response()->stream(function () use ($messages) {
            $client = new Client();

            $response = $client->post($this->baseUrl . '/chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . config('services.open_router.api_key'),
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'model' => 'mistralai/mistral-7b-instruct:free',
                    'messages' => $messages,
                    'stream' => true,
                ],
                'stream' => true,
            ]);

            $body = $response->getBody();
            $buffer = '';

            while (!$body->eof()) {
                $buffer .= $body->read(1024);

                while (($pos = strpos($buffer, "\n")) !== false) {
                    $line = trim(substr($buffer, 0, $pos));
                    $buffer = substr($buffer, $pos + 1);

                    if (!str_starts_with($line, 'data: ')) {
                        continue;
                    }

                    $json = substr($line, 6);

                    if ($json === '[DONE]') {
                        return;
                    }

                    $data = json_decode($json, true);

                    if (isset($data['choices'][0]['delta']['content'])) {
                        echo $data['choices'][0]['delta']['content'];
                        ob_flush();
                        flush();
                    }
                }
            }
        }, 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
