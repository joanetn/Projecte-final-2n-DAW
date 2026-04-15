<?php

namespace App\Modules\Notifications\Infrastructure\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificationChannelMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $subjectLine,
        public readonly string $suceso,
        public readonly string $urgencia,
        public readonly string $messageHtml,
        public readonly string $generatedAt,
    ) {}

    public function build(): self
    {
        return $this
            ->subject($this->subjectLine)
            ->view('notifications.email.notification')
            ->with([
                'subjectLine' => $this->subjectLine,
                'suceso' => $this->suceso,
                'urgencia' => $this->urgencia,
                'messageHtml' => $this->messageHtml,
                'generatedAt' => $this->generatedAt,
            ]);
    }
}
