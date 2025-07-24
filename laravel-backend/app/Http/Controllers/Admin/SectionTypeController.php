<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SectionType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SectionTypeController extends Controller
{
    /**
     * Display a listing of section types
     */
    public function index(Request $request)
    {
        $query = SectionType::query();
        
        // Filter by active status
        if ($request->has('is_active') && $request->is_active !== '') {
            $query->where('is_active', $request->boolean('is_active'));
        }
        
        // Search by name or type
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('type', 'like', '%' . $search . '%');
            });
        }
        
        $sectionTypes = $query->ordered()->paginate(15);
        
        return view('admin.section-types.index', compact('sectionTypes'));
    }

    /**
     * Show the form for creating a new section type
     */
    public function create()
    {
        return view('admin.section-types.create');
    }

    /**
     * Store a newly created section type
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|unique:section_types,type',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'required|string|max:100',
            'thumbnail' => 'nullable|string|max:255',
            'default_data' => 'required|json',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0'
        ]);

        // Parse JSON data
        $validated['default_data'] = json_decode($validated['default_data'], true);

        // Set default sort order if not provided
        if (!isset($validated['sort_order'])) {
            $maxOrder = SectionType::max('sort_order') ?? 0;
            $validated['sort_order'] = $maxOrder + 1;
        }

        SectionType::create($validated);

        return redirect()->route('admin.section-types.index')
            ->with('success', 'Section type created successfully!');
    }

    /**
     * Display the specified section type
     */
    public function show(SectionType $sectionType)
    {
        return view('admin.section-types.show', compact('sectionType'));
    }

    /**
     * Show the form for editing the specified section type
     */
    public function edit(SectionType $sectionType)
    {
        return view('admin.section-types.edit', compact('sectionType'));
    }

    /**
     * Update the specified section type
     */
    public function update(Request $request, SectionType $sectionType)
    {
        $validated = $request->validate([
            'type' => [
                'required',
                'string',
                Rule::unique('section_types', 'type')->ignore($sectionType->id)
            ],
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'required|string|max:100',
            'thumbnail' => 'nullable|string|max:255',
            'default_data' => 'required|json',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0'
        ]);

        // Parse JSON data
        $validated['default_data'] = json_decode($validated['default_data'], true);

        $sectionType->update($validated);

        return redirect()->route('admin.section-types.index')
            ->with('success', 'Section type updated successfully!');
    }

    /**
     * Remove the specified section type
     */
    public function destroy(SectionType $sectionType)
    {
        // Check if section type is being used
        $sectionsCount = \App\Models\Section::where('type', $sectionType->type)->count();
        
        if ($sectionsCount > 0) {
            return redirect()->route('admin.section-types.index')
                ->with('error', "Cannot delete section type. It's being used by {$sectionsCount} section(s).");
        }

        $sectionType->delete();

        return redirect()->route('admin.section-types.index')
            ->with('success', 'Section type deleted successfully!');
    }

    /**
     * Toggle section type active status
     */
    public function toggleStatus(SectionType $sectionType)
    {
        $sectionType->update(['is_active' => !$sectionType->is_active]);

        $status = $sectionType->is_active ? 'activated' : 'deactivated';
        return redirect()->route('admin.section-types.index')
            ->with('success', "Section type {$status} successfully!");
    }
}