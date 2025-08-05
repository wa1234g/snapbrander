<?php

namespace App\Providers;

use App\Services\LocalAIService;
use App\Services\CloudPanelService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(LocalAIService::class, function ($app) {
            return new LocalAIService();
        });

        $this->app->singleton(CloudPanelService::class, function ($app) {
            return new CloudPanelService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
