<?php

namespace App\Modules\Notifications\Application\DTOs;

class ChatMessageDTO
{
    public const ROLE_SYSTEM = 'system';
    public const ROLE_USER = 'user';
    public const ROLE_ASSISTANT = 'assistant';

    public function __construct(
        public readonly string $role,
        public readonly string $content,
    ) {
        if (!in_array($role, [self::ROLE_SYSTEM, self::ROLE_USER, self::ROLE_ASSISTANT])) {
            throw new \InvalidArgumentException("Invalid role: $role");
        }
    }

    public static function fromArray(array $data): self
    {
        return new self(
            role: $data['role'] ?? self::ROLE_USER,
            content: $data['content'] ?? '',
        );
    }

    public static function system(string $content): self
    {
        return new self(role: self::ROLE_SYSTEM, content: $content);
    }

    public static function user(string $content): self
    {
        return new self(role: self::ROLE_USER, content: $content);
    }

    public static function assistant(string $content): self
    {
        return new self(role: self::ROLE_ASSISTANT, content: $content);
    }

    public function toArray(): array
    {
        return [
            'role' => $this->role,
            'content' => $this->content,
        ];
    }
}
