@extends('layouts.admin')

@section('title', 'View Section')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h1 class="h3 mb-1">
            <i class="bi bi-eye me-2"></i>
            Section Details
        </h1>
        <p class="text-muted mb-0">{{ $section->section_id }}</p>
    </div>
    <div class="btn-group">
        <a href="{{ route('admin.sections.edit', $section) }}" class="btn btn-primary">
            <i class="bi bi-pencil me-2"></i>
            Edit
        </a>
        <a href="{{ route('admin.sections.index') }}" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i>
            Back
        </a>
    </div>
</div>

<div class="row">
    <div class="col-lg-8">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">Section Information</h5>
            </div>
            <div class="card-body">
                <dl class="row">
                    <dt class="col-sm-3">Section ID:</dt>
                    <dd class="col-sm-9"><code>{{ $section->section_id }}</code></dd>
                    
                    <dt class="col-sm-3">Landing Page:</dt>
                    <dd class="col-sm-9">
                        <strong>{{ $section->landingPage->title ?? 'Unknown' }}</strong>
                        <br>
                        <small class="text-muted">ID: {{ $section->landing_page_id }}</small>
                    </dd>
                    
                    <dt class="col-sm-3">Type:</dt>
                    <dd class="col-sm-9">
                        <span class="badge bg-info">{{ ucfirst(str_replace('_', ' ', $section->type)) }}</span>
                    </dd>
                    
                    <dt class="col-sm-3">Sort Order:</dt>
                    <dd class="col-sm-9">
                        <span class="badge bg-secondary">{{ $section->sort_order }}</span>
                    </dd>
                    
                    <dt class="col-sm-3">Status:</dt>
                    <dd class="col-sm-9">
                        <span class="badge bg-{{ $section->is_active ? 'success' : 'secondary' }}">
                            {{ $section->is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </dd>
                    
                    <dt class="col-sm-3">Created:</dt>
                    <dd class="col-sm-9">{{ $section->created_at->format('M d, Y H:i:s') }}</dd>
                    
                    <dt class="col-sm-3">Updated:</dt>
                    <dd class="col-sm-9">{{ $section->updated_at->format('M d, Y H:i:s') }}</dd>
                </dl>
            </div>
        </div>

        <div class="card mt-4">
            <div class="card-header">
                <h5 class="card-title mb-0">Section Data</h5>
            </div>
            <div class="card-body">
                <pre class="bg-light p-3 rounded json-editor">{{ json_encode($section->data, JSON_PRETTY_PRINT) }}</pre>
            </div>
        </div>
    </div>
    
    <div class="col-lg-4">
        <div class="card">
            <div class="card-header">
                <h6 class="card-title mb-0">
                    <i class="bi bi-tools me-2"></i>
                    Actions
                </h6>
            </div>
            <div class="card-body">
                <div class="d-grid gap-2">
                    <a href="{{ route('admin.sections.edit', $section) }}" class="btn btn-primary">
                        <i class="bi bi-pencil me-2"></i>
                        Edit Section
                    </a>
                    
                    <form method="POST" action="{{ route('admin.sections.duplicate', $section) }}">
                        @csrf
                        <button type="submit" class="btn btn-outline-secondary w-100">
                            <i class="bi bi-files me-2"></i>
                            Duplicate Section
                        </button>
                    </form>
                    
                    <form method="POST" action="{{ route('admin.sections.toggle-status', $section) }}">
                        @csrf
                        <button type="submit" class="btn btn-outline-{{ $section->is_active ? 'warning' : 'success' }} w-100">
                            <i class="bi bi-{{ $section->is_active ? 'eye-slash' : 'eye' }} me-2"></i>
                            {{ $section->is_active ? 'Deactivate' : 'Activate' }}
                        </button>
                    </form>
                    
                    <hr>
                    
                    <form method="POST" action="{{ route('admin.sections.destroy', $section) }}" 
                          onsubmit="return confirm('Are you sure you want to delete this section?')">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-outline-danger w-100">
                            <i class="bi bi-trash me-2"></i>
                            Delete Section
                        </button>
                    </form>
                </div>
            </div>
        </div>

        @if($section->landingPage)
        <div class="card mt-3">
            <div class="card-header">
                <h6 class="card-title mb-0">
                    <i class="bi bi-file-earmark-text me-2"></i>
                    Landing Page Info
                </h6>
            </div>
            <div class="card-body">
                <dl class="row">
                    <dt class="col-sm-5">Title:</dt>
                    <dd class="col-sm-7">{{ $section->landingPage->title }}</dd>
                    
                    <dt class="col-sm-5">Slug:</dt>
                    <dd class="col-sm-7">
                        <code>{{ $section->landingPage->slug }}</code>
                    </dd>
                    
                    <dt class="col-sm-5">Status:</dt>
                    <dd class="col-sm-7">
                        <span class="badge bg-{{ $section->landingPage->status === 'published' ? 'success' : 'secondary' }}">
                            {{ ucfirst($section->landingPage->status) }}
                        </span>
                    </dd>
                </dl>
                
                @if($section->landingPage->slug)
                <a href="/view/{{ $section->landingPage->slug }}" target="_blank" class="btn btn-sm btn-outline-primary w-100">
                    <i class="bi bi-box-arrow-up-right me-2"></i>
                    View Landing Page
                </a>
                @endif
            </div>
        </div>
        @endif
    </div>
</div>
@endsection