<?php

namespace Database\Seeders;

use App\Enums\MerchBrand;
use App\Modules\Merchandise\Infrastructure\Persistence\Eloquent\Models\MerchModel;
use Illuminate\Database\Seeder;

class MerchandiseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $merchandise = [
            // Babolat
            [
                'nom' => 'Babolat Viper Padel Racket',
                'marca' => MerchBrand::BABOLAT,
                'preu' => 299.99,
                'stock' => 15,
                'isActive' => true,
            ],
            [
                'nom' => 'Babolat Padel Bag',
                'marca' => MerchBrand::BABOLAT,
                'preu' => 89.99,
                'stock' => 25,
                'isActive' => true,
            ],
            // Dunlop
            [
                'nom' => 'Dunlop Blaze Padel Racket',
                'marca' => MerchBrand::DUNLOP,
                'preu' => 249.99,
                'stock' => 20,
                'isActive' => true,
            ],
            [
                'nom' => 'Dunlop Padel Shoes',
                'marca' => MerchBrand::DUNLOP,
                'preu' => 120.00,
                'stock' => 30,
                'isActive' => true,
            ],
            // Head
            [
                'nom' => 'Head Speed Elite Padel Racket',
                'marca' => MerchBrand::HEAD,
                'preu' => 279.99,
                'stock' => 18,
                'isActive' => true,
            ],
            [
                'nom' => 'Head Padel Grips Set',
                'marca' => MerchBrand::HEAD,
                'preu' => 24.99,
                'stock' => 50,
                'isActive' => true,
            ],
            // Nox
            [
                'nom' => 'Nox ML10 Pro Padel Racket',
                'marca' => MerchBrand::NOX,
                'preu' => 289.99,
                'stock' => 22,
                'isActive' => true,
            ],
            [
                'nom' => 'Nox Padel Balls (3 Pack)',
                'marca' => MerchBrand::NOX,
                'preu' => 12.99,
                'stock' => 100,
                'isActive' => true,
            ],
            // Siux
            [
                'nom' => 'Siux Padel Racket',
                'marca' => MerchBrand::SIUX,
                'preu' => 269.99,
                'stock' => 17,
                'isActive' => true,
            ],
            [
                'nom' => 'Siux Padel Wristband',
                'marca' => MerchBrand::SIUX,
                'preu' => 9.99,
                'stock' => 60,
                'isActive' => true,
            ],
        ];

        foreach ($merchandise as $item) {
            MerchModel::create($item);
        }
    }
}
