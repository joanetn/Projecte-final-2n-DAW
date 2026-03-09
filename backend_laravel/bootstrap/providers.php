<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Modules\League\Providers\LeagueServiceProvider::class,
    App\Modules\Match\Providers\MatchServiceProvider::class,
    App\Modules\User\Providers\UserServiceProvider::class,
    App\Modules\Club\Providers\ClubServiceProvider::class,
    App\Modules\Venue\Providers\VenueServiceProvider::class,
    App\Modules\Lineup\Providers\LineupServiceProvider::class,
    App\Modules\Invitation\Providers\InvitationServiceProvider::class,
    App\Modules\Merchandise\Providers\MerchandiseServiceProvider::class,
    App\Modules\Insurance\Providers\InsuranceServiceProvider::class,
    App\Modules\Auth\Providers\AuthServiceProvider::class,
];
