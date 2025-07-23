@extends('layouts.admin')

@section('title', 'Edit Section')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h1 class="h3 mb-1">
            <i class="bi bi-pencil me-2"></i>
            Edit Section
        </h1>
        <p class="text-muted mb-0">Update section: {{ $section->section_id }}</p>
    </div>
    <div class="btn-group">
        <a href="{{ route('admin.sections.show', $section) }}" class="btn btn-outline-info">
            <i class="bi bi-eye me-2"></i>
            View
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
                <h5 class="card-title mb-0">Section Details</h5>
            </div>
            <div class="card-body">
                <form method="POST" action="{{ route('admin.sections.update', $section) }}">
                    @csrf
                    @method('PUT')
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="landing_page_id" class="form-label">Landing Page *</label>
                                <select name="landing_page_id" id="landing_page_id" class="form-select @error('landing_page_id') is-invalid @enderror" required>
                                    <option value="">Select a page</option>
                                    @foreach($landingPages as $page)
                                        <option value="{{ $page->id }}" {{ (old('landing_page_id', $section->landing_page_id) == $page->id) ? 'selected' : '' }}>
                                            {{ $page->title }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('landing_page_id')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="type" class="form-label">Section Type *</label>
                                <select name="type" id="type" class="form-select @error('type') is-invalid @enderror" required>
                                    <option value="">Select a type</option>
                                    @foreach($sectionTypes as $type)
                                        <option value="{{ $type->type }}" {{ (old('type', $section->type) == $type->type) ? 'selected' : '' }}>
                                            {{ $type->name }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('type')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-8">
                            <div class="mb-3">
                                <label for="section_id" class="form-label">Section ID *</label>
                                <input type="text" name="section_id" id="section_id" class="form-control @error('section_id') is-invalid @enderror" 
                                       value="{{ old('section_id', $section->section_id) }}" placeholder="unique-section-id" required>
                                <div class="form-text">Must be unique across all sections</div>
                                @error('section_id')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="sort_order" class="form-label">Sort Order</label>
                                <input type="number" name="sort_order" id="sort_order" class="form-control @error('sort_order') is-invalid @enderror" 
                                       value="{{ old('sort_order', $section->sort_order) }}" min="0">
                                @error('sort_order')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="data" class="form-label">Section Data (JSON) *</label>
                        <textarea name="data" id="data" rows="10" class="form-control json-editor @error('data') is-invalid @enderror" 
                                  placeholder='{"title": "Section Title", "content": "Section content..."}' required>{{ old('data', json_encode($section->data, JSON_PRETTY_PRINT)) }}</textarea>
                        <div class="form-text">Enter section data as valid JSON</div>
                        @error('data')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <div class="form-check">
                            <input type="checkbox" name="is_active" id="is_active" class="form-check-input" value="1" {{ old('is_active', $section->is_active) ? 'checked' : '' }}>
                            <label for="is_active" class="form-check-label">Active Section</label>
                        </div>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-circle me-2"></i>
                            Update Section
                        </button>
                        <a href="{{ route('admin.sections.index') }}" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <div class="col-lg-4">
        <div class="card">
            <div class="card-header">
                <h6 class="card-title mb-0">
                    <i class="bi bi-info-circle me-2"></i>
                    Section Info
                </h6>
            </div>
            <div class="card-body">
                <dl class="row">
                    <dt class="col-sm-4">ID:</dt>
                    <dd class="col-sm-8">{{ $section->id }}</dd>
                    
                    <dt class="col-sm-4">Created:</dt>
                    <dd class="col-sm-8">{{ $section->created_at->format('M d, Y H:i') }}</dd>
                    
                    <dt class="col-sm-4">Updated:</dt>
                    <dd class="col-sm-8">{{ $section->updated_at->format('M d, Y H:i') }}</dd>
                    
                    <dt class="col-sm-4">Status:</dt>
                    <dd class="col-sm-8">
                        <span class="badge bg-{{ $section->is_active ? 'success' : 'secondary' }}">
                            {{ $section->is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </dd>
                </dl>
            </div>
        </div>

        <div class="card mt-3">
            <div class="card-header">
                <h6 class="card-title mb-0">
                    <i class="bi bi-tools me-2"></i>
                    Quick Actions
                </h6>
            </div>
            <div class="card-body">
                <div class="d-grid gap-2">
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
    </div>
</div>
@endsection

@push('scripts')
<script>
// Auto-format JSON
document.getElementById('data').addEventListener('blur', function() {
    try {
        const json = JSON.parse(this.value);
        this.value = JSON.stringify(json, null, 2);
    } catch (e) {
        // Invalid JSON, leave as is
    }
});
</script>
@endpush