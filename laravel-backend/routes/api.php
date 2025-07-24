<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PageBuilderController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\CustomDomainController;
use App\Http\Controllers\Admin\SectionController as AdminSectionController;
use App\Http\Controllers\Admin\SectionTypeController as AdminSectionTypeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('api')->group(function () {
    
    // Page Builder Routes
    Route::prefix('page-builder')->group(function () {
        Route::get('/sections', [PageBuilderController::class, 'getSections']);
        Route::get('/pages', [PageBuilderController::class, 'getPages']);
        Route::get('/slug/{slug}', [PageBuilderController::class, 'getPageBySlug']);
        Route::get('/{id}', [PageBuilderController::class, 'getPage']);
        Route::post('/{id?}', [PageBuilderController::class, 'savePage']);
        Route::delete('/{id}', [PageBuilderController::class, 'deletePage']);
        Route::post('/{id}/duplicate', [PageBuilderController::class, 'duplicatePage']);
    });

    // Order Routes
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/statistics', [OrderController::class, 'statistics']);
        Route::get('/{order}', [OrderController::class, 'show']);
        Route::put('/{order}', [OrderController::class, 'update']);
        Route::delete('/{order}', [OrderController::class, 'destroy']);
    });

    // Section Management Routes
    Route::prefix('sections')->group(function () {
        Route::get('/', [SectionController::class, 'index']);
        Route::post('/', [SectionController::class, 'store']);
        Route::get('/statistics', [SectionController::class, 'statistics']);
        Route::get('/type/{type}', [SectionController::class, 'getByType']);
        Route::post('/update-order', [SectionController::class, 'updateOrder']);
        Route::get('/page/{pageId}', [SectionController::class, 'index']);
        Route::get('/{section}', [SectionController::class, 'show']);
        Route::put('/{section}', [SectionController::class, 'update']);
        Route::delete('/{section}', [SectionController::class, 'destroy']);
        Route::post('/{section}/duplicate', [SectionController::class, 'duplicate']);
        Route::post('/{section}/toggle-status', [SectionController::class, 'toggleStatus']);
    });

    // Custom Domain Routes
    Route::prefix('domains')->group(function () {
        Route::get('/', [CustomDomainController::class, 'index']);
        Route::post('/', [CustomDomainController::class, 'store']);
        Route::get('/{customDomain}', [CustomDomainController::class, 'show']);
        Route::put('/{customDomain}', [CustomDomainController::class, 'update']);
        Route::delete('/{customDomain}', [CustomDomainController::class, 'destroy']);
        Route::post('/{customDomain}/verify', [CustomDomainController::class, 'verifyDns']);
    });

    // Legacy route for frontend compatibility
    Route::post('/order', [OrderController::class, 'store']);

    // Admin Routes (for admin panel)
    Route::prefix('admin')->group(function () {
        // Section Management (Admin)
        Route::prefix('sections')->group(function () {
            Route::get('/', [AdminSectionController::class, 'index']);
            Route::post('/', [AdminSectionController::class, 'store']);
            Route::get('/statistics', [AdminSectionController::class, 'statistics']);
            Route::post('/update-order', [AdminSectionController::class, 'updateOrder']);
            Route::get('/{section}', [AdminSectionController::class, 'show']);
            Route::put('/{section}', [AdminSectionController::class, 'update']);
            Route::delete('/{section}', [AdminSectionController::class, 'destroy']);
            Route::post('/{section}/duplicate', [AdminSectionController::class, 'duplicate']);
            Route::post('/{section}/toggle-status', [AdminSectionController::class, 'toggleStatus']);
        });

        // Section Types Management (Admin)
        Route::prefix('section-types')->group(function () {
            Route::get('/', [AdminSectionTypeController::class, 'index']);
            Route::post('/', [AdminSectionTypeController::class, 'store']);
            Route::post('/update-order', [AdminSectionTypeController::class, 'updateOrder']);
            Route::get('/{sectionType}', [AdminSectionTypeController::class, 'show']);
            Route::put('/{sectionType}', [AdminSectionTypeController::class, 'update']);
            Route::delete('/{sectionType}', [AdminSectionTypeController::class, 'destroy']);
            Route::post('/{sectionType}/toggle-status', [AdminSectionTypeController::class, 'toggleStatus']);
        });
    });
});

// Public routes (if needed)
Route::get('/sections', [PageBuilderController::class, 'getSections']);
Route::get('/domain-lookup', [CustomDomainController::class, 'getByDomain']);