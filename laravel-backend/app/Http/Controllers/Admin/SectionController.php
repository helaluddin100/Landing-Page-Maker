<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Models\LandingPage;
use App\Models\SectionType;
use App\Http\Resources\SectionResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class SectionController extends Controller
{
    /**
     * Display a listing of sections
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Section::with('landingPage');
            
            // Filter by landing page if provided
            if ($request->has('landing_page_id')) {
                $query->forPage($request->landing_page_id);
            }
            
            // Filter by type if provided
            if ($request->has('type')) {
                $query->ofType($request->type);
            }
            
            // Filter by active status
            if ($request->has('is_active')) {
                if ($request->boolean('is_active')) {
                    $query->active();
                } else {
                    $query->where('is_active', false);
                }
            }
            
            // Search by section_id or type
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('section_id', 'like', '%' . $search . '%')
                      ->orWhere('type', 'like', '%' . $search . '%');
                });
            }
            
            $sections = $query->ordered()->paginate(15);
            
            return response()->json([
                'success' => true,
                'data' => SectionResource::collection($sections)->response()->getData()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch sections',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created section
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'landing_page_id' => 'required|exists:landing_pages,id',
                'section_id' => 'required|string|unique:sections,section_id',
                'type' => 'required|string|max:100',
                'data' => 'required|array',
                'sort_order' => 'nullable|integer|min:0',
                'is_active' => 'boolean'
            ]);

            // Set default sort order if not provided
            if (!isset($validated['sort_order'])) {
                $maxOrder = Section::forPage($validated['landing_page_id'])->max('sort_order') ?? 0;
                $validated['sort_order'] = $maxOrder + 1;
            }

            $section = Section::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Section created successfully',
                'data' => new SectionResource($section->load('landingPage'))
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create section',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified section
     */
    public function show(Section $section): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => new SectionResource($section->load('landingPage'))
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Section not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified section
     */
    public function update(Request $request, Section $section): JsonResponse
    {
        try {
            $validated = $request->validate([
                'section_id' => [
                    'sometimes',
                    'string',
                    Rule::unique('sections', 'section_id')->ignore($section->id)
                ],
                'type' => 'sometimes|string|max:100',
                'data' => 'sometimes|array',
                'sort_order' => 'sometimes|integer|min:0',
                'is_active' => 'sometimes|boolean'
            ]);

            $section->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Section updated successfully',
                'data' => new SectionResource($section->fresh()->load('landingPage'))
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update section',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified section
     */
    public function destroy(Section $section): JsonResponse
    {
        try {
            $section->delete();

            return response()->json([
                'success' => true,
                'message' => 'Section deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete section',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk update section order
     */
    public function updateOrder(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'sections' => 'required|array',
                'sections.*.id' => 'required|exists:sections,id',
                'sections.*.sort_order' => 'required|integer|min:0'
            ]);

            foreach ($validated['sections'] as $sectionData) {
                Section::where('id', $sectionData['id'])
                    ->update(['sort_order' => $sectionData['sort_order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Section order updated successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update section order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Duplicate a section
     */
    public function duplicate(Section $section): JsonResponse
    {
        try {
            $newSection = $section->replicate();
            $newSection->section_id = $section->section_id . '-copy-' . time();
            
            // Set new sort order
            $maxOrder = Section::forPage($section->landing_page_id)->max('sort_order') ?? 0;
            $newSection->sort_order = $maxOrder + 1;
            
            $newSection->save();

            return response()->json([
                'success' => true,
                'message' => 'Section duplicated successfully',
                'data' => new SectionResource($newSection->load('landingPage'))
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to duplicate section',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle section active status
     */
    public function toggleStatus(Section $section): JsonResponse
    {
        try {
            $section->update(['is_active' => !$section->is_active]);

            return response()->json([
                'success' => true,
                'message' => 'Section status updated successfully',
                'data' => new SectionResource($section->fresh())
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update section status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get section statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_sections' => Section::count(),
                'active_sections' => Section::active()->count(),
                'inactive_sections' => Section::where('is_active', false)->count(),
                'sections_by_type' => Section::selectRaw('type, COUNT(*) as count')
                    ->groupBy('type')
                    ->pluck('count', 'type'),
                'sections_by_page' => Section::with('landingPage:id,title')
                    ->selectRaw('landing_page_id, COUNT(*) as count')
                    ->groupBy('landing_page_id')
                    ->get()
                    ->map(function ($item) {
                        return [
                            'page_title' => $item->landingPage->title ?? 'Unknown',
                            'section_count' => $item->count
                        ];
                    }),
                'recent_sections' => SectionResource::collection(
                    Section::with('landingPage')
                        ->orderBy('created_at', 'desc')
                        ->limit(5)
                        ->get()
                )
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch section statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}