<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\SectionController;
use App\Http\Controllers\Admin\SectionTypeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('welcome');
});

// Admin Routes
Route::prefix('admin')->name('admin.')->group(function () {
    
    // Dashboard
    Route::get('/', function () {
        return redirect()->route('admin.sections.index');
    })->name('dashboard');
    
    // Section Management
    Route::resource('sections', SectionController::class);
    Route::post('sections/{section}/duplicate', [SectionController::class, 'duplicate'])->name('sections.duplicate');
    Route::post('sections/{section}/toggle-status', [SectionController::class, 'toggleStatus'])->name('sections.toggle-status');
    Route::post('sections/update-order', [SectionController::class, 'updateOrder'])->name('sections.update-order');
    
    // Section Type Management
    Route::resource('section-types', SectionTypeController::class);
    Route::post('section-types/{sectionType}/toggle-status', [SectionTypeController::class, 'toggleStatus'])->name('section-types.toggle-status');
    Route::post('section-types/update-order', [SectionTypeController::class, 'updateOrder'])->name('section-types.update-order');
    
});