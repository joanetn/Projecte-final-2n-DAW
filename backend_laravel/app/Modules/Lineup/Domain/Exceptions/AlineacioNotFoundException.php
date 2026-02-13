<?php
namespace App\Modules\Lineup\Domain\Exceptions;
use DomainException;
class AlineacioNotFoundException extends DomainException
{
    public function __construct(string $alineacioId)
    {
        parent::__construct(
            message: "Alineació amb ID '$alineacioId' no trobada",
            code: 404
        );
    }
    public static function withId(string $alineacioId): self
    {
        return new self($alineacioId);
    }
    public function toArray(): array
    {
        return [
            'error' => 'ALINEACIO_NOT_FOUND',
            'message' => $this->getMessage(),
            'code' => $this->getCode()
        ];
    }
}
