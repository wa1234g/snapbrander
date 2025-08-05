<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $settings = Setting::where('is_public', true)->get();

        $formattedSettings = [];
        foreach ($settings as $setting) {
            $formattedSettings[$setting->key] = Setting::get($setting->key);
        }

        return response()->json($formattedSettings);
    }

    public function public(): JsonResponse
    {
        $publicSettings = Setting::where('is_public', true)->get();

        $settings = [];
        foreach ($publicSettings as $setting) {
            $settings[$setting->key] = Setting::get($setting->key);
        }

        return response()->json($settings);
    }

    public function update(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($request->settings as $key => $value) {
            $type = $this->determineType($value);
            Setting::set($key, $value, $type);
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    private function determineType($value): string
    {
        if (is_bool($value)) {
            return 'boolean';
        }

        if (is_int($value)) {
            return 'integer';
        }

        if (is_float($value)) {
            return 'float';
        }

        if (is_array($value)) {
            return 'array';
        }

        return 'string';
    }
}
