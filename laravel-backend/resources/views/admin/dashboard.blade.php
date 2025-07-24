@extends('layouts.admin')

@section('title', 'Dashboard')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h1 class="h3 mb-1">
            <i class="bi bi-speedometer2 me-2"></i>
            Admin Dashboard
        </h1>
        <p class="text-muted mb-0">Manage your landing page builder</p>
    </div>
</div>

<div class="row">
    <!-- Statistics Cards -->
    <div class="col-lg-3 col-md-6 mb-4">
        <div class="card bg-primary text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h4 class="mb-0">{{ \App\Models\Section::count() }}</h4>
                        <p class="mb-0">Total Sections</p>
                    </div>
                    <div class="align-self-center">
                        <i class="bi bi-puzzle fs-1"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-lg-3 col-md-6 mb-4">
        <div class="card bg-success text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h4 class="mb-0">{{ \App\Models\SectionType::active()->count() }}</h4>
                        <p class="mb-0">Section Types</p>
                    </div>
                    <div class="align-self-center">
                        <i class="bi bi-collection fs-1"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-lg-3 col-md-6 mb-4">
        <div class="card bg-info text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h4 class="mb-0">{{ \App\Models\LandingPage::count() }}</h4>
                        <p class="mb-0">Landing Pages</p>
                    </div>
                    <div class="align-self-center">
                        <i class="bi bi-file-earmark-text fs-1"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-lg-3 col-md-6 mb-4">
        <div class="card bg-warning text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h4 class="mb-0">{{ \App\Models\Section::active()->count() }}</h4>
                        <p class="mb-0">Active Sections</p>
                    </div>
                    <div class="align-self-center">
                        <i class="bi bi-check-circle fs-1"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Quick Actions -->
<div class="row">
    <div class="col-lg-6 mb-4">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">
                    <i class="bi bi-lightning me-2"></i>
                    Quick Actions
                </h5>
            </div>
            <div class="card-body">
                <div class="d-grid gap-2">
                    <a href="{{ route('admin.sections.create') }}" class="btn btn-primary">
                        <i class="bi bi-plus-circle me-2"></i>
                        Create New Section
                    </a>
                    <a href="{{ route('admin.section-types.create') }}" class="btn btn-success">
                        <i class="bi bi-plus-circle me-2"></i>
                        Create Section Type
                    </a>
                    <a href="{{ route('admin.sections.index') }}" class="btn btn-outline-primary">
                        <i class="bi bi-list-ul me-2"></i>
                        Manage All Sections
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-lg-6 mb-4">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">
                    <i class="bi bi-clock-history me-2"></i>
                    Recent Sections
                </h5>
            </div>
            <div class="card-body">
                @php
                    $recentSections = \App\Models\Section::with('landingPage')->latest()->limit(5)->get();
                @endphp
                
                @if($recentSections->count() > 0)
                    <div class="list-group list-group-flush">
                        @foreach($recentSections as $section)
                            <div class="list-group-item d-flex justify-content-between align-items-center px-0">
                                <div>
                                    <strong>{{ $section->section_id }}</strong>
                                    <br>
                                    <small class="text-muted">{{ $section->landingPage->title ?? 'Unknown Page' }}</small>
                                </div>
                                <div>
                                    <span class="badge bg-{{ $section->is_active ? 'success' : 'secondary' }}">
                                        {{ $section->is_active ? 'Active' : 'Inactive' }}
                                    </span>
                                    <a href="{{ route('admin.sections.show', $section) }}" class="btn btn-sm btn-outline-primary ms-2">
                                        View
                                    </a>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @else
                    <p class="text-muted mb-0">No sections created yet.</p>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection