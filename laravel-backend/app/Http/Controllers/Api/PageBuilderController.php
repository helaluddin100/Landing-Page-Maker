<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LandingPage;
use App\Models\SectionType;
use App\Http\Resources\SectionTypeResource;
use App\Http\Resources\LandingPageResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class PageBuilderController extends Controller
{
    /**
     * Get all available section types
     */
    public function getSections(): JsonResponse
    {
        try {
            $sections = SectionType::active()->ordered()->get();
            
            return response()->json([
                'success' => true,
                'data' => SectionTypeResource::collection($sections)
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
     * Get a landing page by slug
     */
    public function getPageBySlug($slug): JsonResponse
    {
        try {
            $page = LandingPage::where('slug', $slug)
                ->where('status', 'published')
                ->firstOrFail();
            
            return response()->json([
                'success' => true,
                'data' => new LandingPageResource($page)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Page not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }
    /**
     * Get a specific landing page
     */
    public function getPage($id): JsonResponse
    {
        try {
            $page = LandingPage::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => new LandingPageResource($page)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Page not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Get all landing pages
     */
    public function getPages(Request $request): JsonResponse
    {
        try {
            $query = LandingPage::query();
            
            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            // Search by title if provided
            if ($request->has('search')) {
                $query->where('title', 'like', '%' . $request->search . '%');
            }
            
            $pages = $query->orderBy('updated_at', 'desc')->paginate(15);
            
            return response()->json([
                'success' => true,
                'data' => LandingPageResource::collection($pages)->response()->getData()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch pages',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save or update a landing page
     */
    public function savePage(Request $request, $id = null): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'sections' => 'required|array',
                'sections.*.id' => 'required|string',
                'sections.*.type' => 'required|string',
                'sections.*.data' => 'required|array',
                'slug' => 'nullable|string|max:255',
                'status' => ['nullable', Rule::in(['draft', 'published', 'archived'])],
                'meta_description' => 'nullable|string|max:500',
                'meta_keywords' => 'nullable|string|max:255'
            ]);

            if ($id) {
                // Update existing page
                $page = LandingPage::findOrFail($id);
                
                // Generate unique slug if title changed
                if ($page->title !== $validated['title']) {
                    $validated['slug'] = $page->generateUniqueSlug($validated['title']);
                }
                
                $page->update($validated);
            } else {
                // Create new page
                if (empty($validated['slug'])) {
                    $validated['slug'] = LandingPage::make()->generateUniqueSlug($validated['title']);
                }
                
                $page = LandingPage::create($validated);
            }

            return response()->json([
                'success' => true,
                'message' => $id ? 'Page updated successfully' : 'Page created successfully',
                'data' => new LandingPageResource($page)
            ], $id ? 200 : 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save page',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a landing page
     */
    public function deletePage($id): JsonResponse
    {
        try {
            $page = LandingPage::findOrFail($id);
            $page->delete();

            return response()->json([
                'success' => true,
                'message' => 'Page deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete page',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Duplicate a landing page
     */
    public function duplicatePage($id): JsonResponse
    {
        try {
            $originalPage = LandingPage::findOrFail($id);
            
            $newPage = $originalPage->replicate();
            $newPage->title = $originalPage->title . ' (Copy)';
            $newPage->slug = $newPage->generateUniqueSlug($newPage->title);
            $newPage->status = 'draft';
            $newPage->save();

            return response()->json([
                'success' => true,
                'message' => 'Page duplicated successfully',
                'data' => new LandingPageResource($newPage)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to duplicate page',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}