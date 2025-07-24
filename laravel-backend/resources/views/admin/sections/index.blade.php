@extends('layouts.admin')

@section('title', 'Sections Management')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h1 class="h3 mb-1">
            <i class="bi bi-puzzle me-2"></i>
            Sections Management
        </h1>
        <p class="text-muted mb-0">Manage sections for landing pages</p>
    </div>
    <a href="{{ route('admin.sections.create') }}" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i>
        Add Section
    </a>
</div>

<!-- Filters -->
<div class="card mb-4">
    <div class="card-body">
        <form method="GET" action="{{ route('admin.sections.index') }}">
            <div class="row g-3">
                <div class="col-md-3">
                    <label class="form-label">Filter by Page</label>
                    <select name="landing_page_id" class="form-select">
                        <option value="">All Pages</option>
                        @foreach($landingPages as $page)
                            <option value="{{ $page->id }}" {{ request('landing_page_id') == $page->id ? 'selected' : '' }}>
                                {{ $page->title }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Filter by Type</label>
                    <select name="type" class="form-select">
                        <option value="">All Types</option>
                        @foreach($sectionTypes as $type)
                            <option value="{{ $type->type }}" {{ request('type') == $type->type ? 'selected' : '' }}>
                                {{ $type->name }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Filter by Status</label>
                    <select name="is_active" class="form-select">
                        <option value="">All Status</option>
                        <option value="1" {{ request('is_active') === '1' ? 'selected' : '' }}>Active</option>
                        <option value="0" {{ request('is_active') === '0' ? 'selected' : '' }}>Inactive</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Search</label>
                    <div class="input-group">
                        <input type="text" name="search" class="form-control" placeholder="Search sections..." value="{{ request('search') }}">
                        <button class="btn btn-outline-secondary" type="submit">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- Sections Table -->
<div class="card">
    <div class="card-header">
        <h5 class="card-title mb-0">
            <i class="bi bi-list-ul me-2"></i>
            All Sections ({{ $sections->total() }})
        </h5>
    </div>
    <div class="card-body p-0">
        @if($sections->count() > 0)
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Section</th>
                            <th>Page</th>
                            <th>Type</th>
                            <th>Order</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th width="150">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($sections as $section)
                            <tr>
                                <td>
                                    <div>
                                        <strong>{{ $section->section_id }}</strong>
                                        <br>
                                        <small class="text-muted">ID: {{ $section->id }}</small>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <strong>{{ $section->landingPage->title ?? 'Unknown' }}</strong>
                                        <br>
                                        <small class="text-muted">Page ID: {{ $section->landing_page_id }}</small>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge bg-info">{{ ucfirst(str_replace('_', ' ', $section->type)) }}</span>
                                </td>
                                <td>
                                    <span class="badge bg-secondary">{{ $section->sort_order }}</span>
                                </td>
                                <td>
                                    <form method="POST" action="{{ route('admin.sections.toggle-status', $section) }}" class="d-inline">
                                        @csrf
                                        <button type="submit" class="btn btn-link p-0 border-0">
                                            <span class="badge bg-{{ $section->is_active ? 'success' : 'secondary' }}">
                                                {{ $section->is_active ? 'Active' : 'Inactive' }}
                                            </span>
                                        </button>
                                    </form>
                                </td>
                                <td>
                                    <small class="text-muted">{{ $section->created_at->format('M d, Y') }}</small>
                                </td>
                                <td>
                                    <div class="btn-group" role="group">
                                        <a href="{{ route('admin.sections.show', $section) }}" class="btn btn-sm btn-outline-info" title="View">
                                            <i class="bi bi-eye"></i>
                                        </a>
                                        <a href="{{ route('admin.sections.edit', $section) }}" class="btn btn-sm btn-outline-primary" title="Edit">
                                            <i class="bi bi-pencil"></i>
                                        </a>
                                        <form method="POST" action="{{ route('admin.sections.duplicate', $section) }}" class="d-inline">
                                            @csrf
                                            <button type="submit" class="btn btn-sm btn-outline-secondary" title="Duplicate">
                                                <i class="bi bi-files"></i>
                                            </button>
                                        </form>
                                        <form method="POST" action="{{ route('admin.sections.destroy', $section) }}" class="d-inline" 
                                              onsubmit="return confirm('Are you sure you want to delete this section?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-sm btn-outline-danger" title="Delete">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div class="text-center py-5">
                <i class="bi bi-puzzle display-1 text-muted mb-3"></i>
                <h5>No sections found</h5>
                <p class="text-muted">Create your first section to get started</p>
                <a href="{{ route('admin.sections.create') }}" class="btn btn-primary">
                    <i class="bi bi-plus-circle me-2"></i>
                    Create Section
                </a>
            </div>
        @endif
    </div>
    
    @if($sections->hasPages())
        <div class="card-footer">
            {{ $sections->links() }}
        </div>
    @endif
</div>
@endsection