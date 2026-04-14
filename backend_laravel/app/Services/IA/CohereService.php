<?php

namespace App\Services\IA;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Http;

class CohereService
{
    protected string $baseUrl = 'https://api.cohere.com/v2';

    public function chat(array|string $messages): string
    {
        /** @var \Illuminate\Http\Client\Response $response */
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.cohere.api_key'),
            'Content-Type' => 'application/json',
        ])->post($this->baseUrl . '/chat', [
            'model' => 'command',
            'messages' => $messages,
        ]);

        if (!$response->successful()) {
            throw new \Exception('Error en Cohere: ' . $response->body());
        }

        $data = $response->json();

        return $data['message']['content'][0]['text']
            ?? throw new \Exception('Respuesta inválida: ' . json_encode($data));
    }

    public function stream(array $messages)
    {
        return response()->stream(function () use ($messages) {

            $client = new Client();

            $response = $client->post($this->baseUrl . '/chat', [
                'headers' => [
                    'Authorization' => 'Bearer ' . config('services.cohere.api_key'),
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'model' => 'command',
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

                    if (!str_starts_with($line, 'data:')) {
                        continue;
                    }

                    $json = trim(substr($line, 5));

                    if ($json === '[DONE]') {
                        return;
                    }

                    $data = json_decode($json, true);

                    if (isset($data['type']) && $data['type'] === 'content-delta') {
                        $text = $data['delta']['message']['content']['text'] ?? '';

                        echo $text;
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
