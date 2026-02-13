<?php
namespace App\Modules\Lineup\Application\DTOs;
class UpdatePuntuacioDTO
{
    public function __construct(
        public readonly ?int $punts = null,
        public readonly ?bool $isActive = null
    ) {}
    public static function fromArray(array $data): self
    {
        return new self(
            punts: $data['punts'] ?? null,
            isActive: isset($data['isActive']) ? (bool) $data['isActive'] : null
        );
    }
}
