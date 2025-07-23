<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SectionType;
use App\Http\Resources\SectionTypeResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class SectionTypeController extends Controller
{
    /**
     * Display a listing of section types
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = SectionType::query();
            
            // Filter by active status
            if ($request->has('is_active')) {
                $query->where('is_active', $request->boolean('is_active'));
            }
            
            // Search by name or type
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('type', 'like', '%' . $search . '%');
                });
            }
            
            $sectionTypes = $query->ordered()->paginate(15);
            
            return response()->json([
                'success' => true,
                'data' => SectionTypeResource::collection($sectionTypes)->response()->getData()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch section types',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created section type
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'type' => 'required|string|unique:section_types,type',
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'icon' => 'required|string|max:100',
                'thumbnail' => 'nullable|string|max:255',
                'default_data' => 'required|array',
                'is_active' => 'boolean',
                'sort_order' => 'nullable|integer|min:0'
            ]);

            // Set default sort order if not provided
            if (!isset($validated['sort_order'])) {
                $maxOrder = SectionType::max('sort_order') ?? 0;
                $validated['sort_order'] = $maxOrder + 1;
            }

            $sectionType = SectionType::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Section type created successfully',
                'data' => new SectionTypeResource($sectionType)
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
                'message' => 'Failed to create section type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified section type
     */
    public function show(SectionType $sectionType): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => new SectionTypeResource($sectionType)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Section type not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified section type
     */
    public function update(Request $request, SectionType $sectionType): JsonResponse
    {
        try {
            $validated = $request->validate([
                'type' => [
                    'sometimes',
                    'string',
                    Rule::unique('section_types', 'type')->ignore($sectionType->id)
                ],
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'icon' => 'sometimes|string|max:100',
                'thumbnail' => 'sometimes|nullable|string|max:255',
                'default_data' => 'sometimes|array',
                'is_active' => 'sometimes|boolean',
                'sort_order' => 'sometimes|integer|min:0'
            ]);

            $sectionType->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Section type updated successfully',
                'data' => new SectionTypeResource($sectionType->fresh())
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
                'message' => 'Failed to update section type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified section type
     */
    public function destroy(SectionType $sectionType): JsonResponse
    {
        try {
            // Check if section type is being used
            $sectionsCount = \App\Models\Section::where('type', $sectionType->type)->count();
            
            if ($sectionsCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Cannot delete section type. It's being used by {$sectionsCount} section(s)."
                ], 422);
            }

            $sectionType->delete();

            return response()->json([
                'success' => true,
                'message' => 'Section type deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete section type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle section type active status
     */
    public function toggleStatus(SectionType $sectionType): JsonResponse
    {
        try {
            $sectionType->update(['is_active' => !$sectionType->is_active]);

            return response()->json([
                'success' => true,
                'message' => 'Section type status updated successfully',
                'data' => new SectionTypeResource($sectionType->fresh())
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update section type status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update section types order
     */
    public function updateOrder(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'section_types' => 'required|array',
                'section_types.*.id' => 'required|exists:section_types,id',
                'section_types.*.sort_order' => 'required|integer|min:0'
            ]);

            foreach ($validated['section_types'] as $typeData) {
                SectionType::where('id', $typeData['id'])
                    ->update(['sort_order' => $typeData['sort_order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Section types order updated successfully'
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
                'message' => 'Failed to update section types order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}