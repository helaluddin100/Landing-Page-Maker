<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Models\LandingPage;
use App\Models\SectionType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SectionController extends Controller
{
    /**
     * Display a listing of sections
     */
    public function index(Request $request)
    {
        $query = Section::with('landingPage');
        
        // Filter by landing page if provided
        if ($request->has('landing_page_id') && $request->landing_page_id) {
            $query->forPage($request->landing_page_id);
        }
        
        // Filter by type if provided
        if ($request->has('type') && $request->type) {
            $query->ofType($request->type);
        }
        
        // Filter by active status
        if ($request->has('is_active') && $request->is_active !== '') {
            $query->where('is_active', $request->boolean('is_active'));
        }
        
        // Search by section_id or type
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('section_id', 'like', '%' . $search . '%')
                  ->orWhere('type', 'like', '%' . $search . '%');
            });
        }
        
        $sections = $query->ordered()->paginate(15);
        $landingPages = LandingPage::all();
        $sectionTypes = SectionType::active()->ordered()->get();
        
        return view('admin.sections.index', compact('sections', 'landingPages', 'sectionTypes'));
    }

    /**
     * Show the form for creating a new section
     */
    public function create()
    {
        $landingPages = LandingPage::all();
        $sectionTypes = SectionType::active()->ordered()->get();
        
        return view('admin.sections.create', compact('landingPages', 'sectionTypes'));
    }

    /**
     * Store a newly created section
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'landing_page_id' => 'required|exists:landing_pages,id',
            'section_id' => 'required|string|unique:sections,section_id',
            'type' => 'required|string|max:100',
            'data' => 'required|json',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean'
        ]);

        // Parse JSON data
        $validated['data'] = json_decode($validated['data'], true);

        // Set default sort order if not provided
        if (!isset($validated['sort_order'])) {
            $maxOrder = Section::forPage($validated['landing_page_id'])->max('sort_order') ?? 0;
            $validated['sort_order'] = $maxOrder + 1;
        }

        Section::create($validated);

        return redirect()->route('admin.sections.index')
            ->with('success', 'Section created successfully!');
    }

    /**
     * Display the specified section
     */
    public function show(Section $section)
    {
        $section->load('landingPage');
        return view('admin.sections.show', compact('section'));
    }

    /**
     * Show the form for editing the specified section
     */
    public function edit(Section $section)
    {
        $landingPages = LandingPage::all();
        $sectionTypes = SectionType::active()->ordered()->get();
        
        return view('admin.sections.edit', compact('section', 'landingPages', 'sectionTypes'));
    }

    /**
     * Update the specified section
     */
    public function update(Request $request, Section $section)
    {
        $validated = $request->validate([
            'landing_page_id' => 'required|exists:landing_pages,id',
            'section_id' => [
                'required',
                'string',
                Rule::unique('sections', 'section_id')->ignore($section->id)
            ],
            'type' => 'required|string|max:100',
            'data' => 'required|json',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean'
        ]);

        // Parse JSON data
        $validated['data'] = json_decode($validated['data'], true);

        $section->update($validated);

        return redirect()->route('admin.sections.index')
            ->with('success', 'Section updated successfully!');
    }

    /**
     * Remove the specified section
     */
    public function destroy(Section $section)
    {
        $section->delete();

        return redirect()->route('admin.sections.index')
            ->with('success', 'Section deleted successfully!');
    }

    /**
     * Duplicate a section
     */
    public function duplicate(Section $section)
    {
        $newSection = $section->replicate();
        $newSection->section_id = $section->section_id . '-copy-' . time();
        
        // Set new sort order
        $maxOrder = Section::forPage($section->landing_page_id)->max('sort_order') ?? 0;
        $newSection->sort_order = $maxOrder + 1;
        
        $newSection->save();

        return redirect()->route('admin.sections.index')
            ->with('success', 'Section duplicated successfully!');
    }

    /**
     * Toggle section active status
     */
    public function toggleStatus(Section $section)
    {
        $section->update(['is_active' => !$section->is_active]);

        $status = $section->is_active ? 'activated' : 'deactivated';
        return redirect()->route('admin.sections.index')
            ->with('success', "Section {$status} successfully!");
    }

    /**
     * Bulk update section order
     */
    public function updateOrder(Request $request)
    {
        $validated = $request->validate([
            'sections' => 'required|array',
            'sections.*.id' => 'required|exists:sections,id',
            'sections.*.sort_order' => 'required|integer|min:0'
        ]);

        foreach ($validated['sections'] as $sectionData) {
            Section::where('id', $sectionData['id'])
                ->update(['sort_order' => $sectionData['sort_order']]);
        }

        return redirect()->route('admin.sections.index')
            ->with('success', 'Section order updated successfully!');
    }
}