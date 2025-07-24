@extends('layouts.admin')

@section('title', 'Create Section')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h1 class="h3 mb-1">
            <i class="bi bi-plus-circle me-2"></i>
            Create Section
        </h1>
        <p class="text-muted mb-0">Add a new section to a landing page</p>
    </div>
    <a href="{{ route('admin.sections.index') }}" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-2"></i>
        Back to Sections
    </a>
</div>

<div class="row">
    <div class="col-lg-8">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">Section Details</h5>
            </div>
            <div class="card-body">
                <form method="POST" action="{{ route('admin.sections.store') }}">
                    @csrf
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="landing_page_id" class="form-label">Landing Page *</label>
                                <select name="landing_page_id" id="landing_page_id" class="form-select @error('landing_page_id') is-invalid @enderror" required>
                                    <option value="">Select a page</option>
                                    @foreach($landingPages as $page)
                                        <option value="{{ $page->id }}" {{ old('landing_page_id') == $page->id ? 'selected' : '' }}>
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
                                        <option value="{{ $type->type }}" {{ old('type') == $type->type ? 'selected' : '' }}>
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
                                       value="{{ old('section_id') }}" placeholder="unique-section-id" required>
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
                                       value="{{ old('sort_order', 0) }}" min="0">
                                @error('sort_order')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="data" class="form-label">Section Data (JSON) *</label>
                        <textarea name="data" id="data" rows="10" class="form-control json-editor @error('data') is-invalid @enderror" 
                                  placeholder='{"title": "Section Title", "content": "Section content..."}' required>{{ old('data', '{}') }}</textarea>
                        <div class="form-text">Enter section data as valid JSON</div>
                        @error('data')
                            <div class="invalid-feedback">{{ $message }}</div>
                        @enderror
                    </div>

                    <div class="mb-3">
                        <div class="form-check">
                            <input type="checkbox" name="is_active" id="is_active" class="form-check-input" value="1" {{ old('is_active', true) ? 'checked' : '' }}>
                            <label for="is_active" class="form-check-label">Active Section</label>
                        </div>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-circle me-2"></i>
                            Create Section
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
                    Help
                </h6>
            </div>
            <div class="card-body">
                <h6>Section Data Examples:</h6>
                
                <p><strong>Hero Section:</strong></p>
                <pre class="bg-light p-2 rounded small">{
  "title": "Welcome to Our Store",
  "subtitle": "Amazing products await",
  "primaryButtonText": "Shop Now",
  "secondaryButtonText": "Learn More"
}</pre>

                <p><strong>Product Showcase:</strong></p>
                <pre class="bg-light p-2 rounded small">{
  "title": "Featured Products",
  "subtitle": "Check out our best sellers"
}</pre>

                <p><strong>CTA Section:</strong></p>
                <pre class="bg-light p-2 rounded small">{
  "title": "Ready to Get Started?",
  "subtitle": "Join us today",
  "primaryButtonText": "Get Started"
}</pre>
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

// Load default data when section type changes
document.getElementById('type').addEventListener('change', function() {
    const sectionTypes = @json($sectionTypes->keyBy('type'));
    const selectedType = this.value;
    
    if (selectedType && sectionTypes[selectedType]) {
        const defaultData = sectionTypes[selectedType].default_data;
        document.getElementById('data').value = JSON.stringify(defaultData, null, 2);
    }
});
</script>
@endpush