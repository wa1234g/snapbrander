<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\AIController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\DraftController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\TeamController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('user', [AuthController::class, 'user']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
    });
});

Route::get('templates', [TemplateController::class, 'index']);
Route::get('templates/{template}', [TemplateController::class, 'show']);
Route::get('modules', [ModuleController::class, 'index']);
Route::get('settings/public', [SettingsController::class, 'public']);

Route::middleware('auth:sanctum')->group(function () {
    
    Route::prefix('projects')->group(function () {
        Route::get('/', [ProjectController::class, 'index']);
        Route::post('init', [ProjectController::class, 'init']);
        Route::get('{project}', [ProjectController::class, 'show']);
        Route::put('{project}', [ProjectController::class, 'update']);
        Route::delete('{project}', [ProjectController::class, 'destroy']);
        Route::post('{project}/select-template', [ProjectController::class, 'selectTemplate']);
        Route::post('{project}/set-colors', [ProjectController::class, 'setColors']);
        Route::post('{project}/upload-logo', [ProjectController::class, 'uploadLogo']);
        Route::post('{project}/generate-site', [ProjectController::class, 'generateSite']);
        Route::get('{project}/status', [ProjectController::class, 'status']);
        Route::post('{project}/archive', [ProjectController::class, 'archive']);
        Route::post('{project}/restore', [ProjectController::class, 'restore']);
    });

    Route::prefix('ai')->group(function () {
        Route::post('generate-description', [AIController::class, 'generateDescription']);
        Route::post('generate-content', [AIController::class, 'generateContent']);
        Route::post('generate-colors', [AIController::class, 'generateColors']);
        Route::post('generate-logo', [AIController::class, 'generateLogo']);
        Route::post('translate', [AIController::class, 'translate']);
        Route::post('chat', [AIController::class, 'chat']);
        Route::get('chat/{session}', [AIController::class, 'getChatSession']);
    });

    Route::prefix('drafts')->group(function () {
        Route::get('/', [DraftController::class, 'index']);
        Route::post('save', [DraftController::class, 'save']);
        Route::post('resume', [DraftController::class, 'resume']);
        Route::delete('{draft}', [DraftController::class, 'destroy']);
    });

    Route::prefix('media')->group(function () {
        Route::get('/', [MediaController::class, 'index']);
        Route::post('upload', [MediaController::class, 'upload']);
        Route::delete('{media}', [MediaController::class, 'destroy']);
        Route::post('{media}/edit', [MediaController::class, 'aiEdit']);
    });

    Route::prefix('teams')->group(function () {
        Route::get('projects/{project}/members', [TeamController::class, 'index']);
        Route::post('projects/{project}/invite', [TeamController::class, 'invite']);
        Route::put('projects/{project}/members/{member}', [TeamController::class, 'updateRole']);
        Route::delete('projects/{project}/members/{member}', [TeamController::class, 'remove']);
    });

    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingsController::class, 'index']);
        Route::put('/', [SettingsController::class, 'update']);
    });

    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::apiResource('templates', TemplateController::class)->except(['index', 'show']);
        Route::apiResource('modules', ModuleController::class)->except(['index']);
        Route::get('users', [AuthController::class, 'adminUsers']);
        Route::get('projects', [ProjectController::class, 'adminIndex']);
        Route::get('analytics', [ProjectController::class, 'analytics']);
    });
});
