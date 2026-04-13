<?php

namespace App\Modules\Notifications\Application\DTOs;

use DateTime;

class StatusReportDTO
{
    /**
     * @param ProviderStatusDTO[] $report
     * @param string[] $activeBlacklist
     */
    public function __construct(
        public readonly DateTime $timestamp,
        public readonly int $totalProviders,
        public readonly array $report,
        public readonly array $activeBlacklist,
    ) {}

    public static function fromArray(array $data): self
    {
        $reportItems = array_map(
            fn($item) => ProviderStatusDTO::fromArray($item),
            $data['report'] ?? []
        );

        return new self(
            timestamp: $data['timestamp'] instanceof DateTime
                ? $data['timestamp']
                : new DateTime($data['timestamp'] ?? 'now'),
            totalProviders: $data['total_providers'] ?? count($reportItems),
            report: $reportItems,
            activeBlacklist: $data['active_blacklist'] ?? [],
        );
    }

    public function toArray(): array
    {
        return [
            'timestamp' => $this->timestamp->format('c'),
            'total_providers' => $this->totalProviders,
            'report' => array_map(fn($item) => $item->toArray(), $this->report),
            'active_blacklist' => $this->activeBlacklist,
        ];
    }
}
