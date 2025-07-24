<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomDomain;
use App\Models\LandingPage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class CustomDomainController extends Controller
{
    /**
     * Get all custom domains
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = CustomDomain::with('landingPage');
            
            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('verification_status', $request->status);
            }
            
            // Filter by active status
            if ($request->has('active')) {
                $query->where('is_active', $request->boolean('active'));
            }
            
            // Search by domain name
            if ($request->has('search')) {
                $query->where('domain', 'like', '%' . $request->search . '%');
            }
            
            $domains = $query->orderBy('created_at', 'desc')->paginate(15);
            
            return response()->json([
                'success' => true,
                'data' => $domains
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch domains',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new custom domain
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'domain' => 'required|string|max:255|unique:custom_domains,domain',
                'landing_page_id' => 'required|exists:landing_pages,id',
                'is_active' => 'boolean',
                'notes' => 'nullable|string|max:1000'
            ]);

            // Clean domain name (remove protocol, www, trailing slash)
            $domain = $this->cleanDomainName($validated['domain']);
            $validated['domain'] = $domain;

            // Check if landing page exists and is published
            $landingPage = LandingPage::findOrFail($validated['landing_page_id']);
            if ($landingPage->status !== 'published') {
                return response()->json([
                    'success' => false,
                    'message' => 'Landing page must be published before assigning a custom domain'
                ], 422);
            }

            $domain = CustomDomain::create($validated);

            // TODO: Trigger DNS verification process
            // $this->initiateDnsVerification($domain);

            return response()->json([
                'success' => true,
                'message' => 'Custom domain created successfully',
                'data' => $domain->load('landingPage')
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
                'message' => 'Failed to create domain',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific custom domain
     */
    public function show(CustomDomain $customDomain): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $customDomain->load('landingPage')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Domain not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update a custom domain
     */
    public function update(Request $request, CustomDomain $customDomain): JsonResponse
    {
        try {
            $validated = $request->validate([
                'domain' => [
                    'sometimes',
                    'string',
                    'max:255',
                    Rule::unique('custom_domains', 'domain')->ignore($customDomain->id)
                ],
                'landing_page_id' => 'sometimes|exists:landing_pages,id',
                'is_active' => 'sometimes|boolean',
                'notes' => 'sometimes|nullable|string|max:1000'
            ]);

            // Clean domain name if provided
            if (isset($validated['domain'])) {
                $validated['domain'] = $this->cleanDomainName($validated['domain']);
            }

            // Check landing page status if changing
            if (isset($validated['landing_page_id'])) {
                $landingPage = LandingPage::findOrFail($validated['landing_page_id']);
                if ($landingPage->status !== 'published') {
                    return response()->json([
                        'success' => false,
                        'message' => 'Landing page must be published before assigning a custom domain'
                    ], 422);
                }
            }

            $customDomain->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Domain updated successfully',
                'data' => $customDomain->fresh()->load('landingPage')
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
                'message' => 'Failed to update domain',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a custom domain
     */
    public function destroy(CustomDomain $customDomain): JsonResponse
    {
        try {
            $customDomain->delete();

            return response()->json([
                'success' => true,
                'message' => 'Domain deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete domain',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify domain DNS configuration
     */
    public function verifyDns(CustomDomain $customDomain): JsonResponse
    {
        try {
            // TODO: Implement actual DNS verification
            $isVerified = $this->checkDnsConfiguration($customDomain->domain);
            
            if ($isVerified) {
                $customDomain->markAsVerified();
                
                return response()->json([
                    'success' => true,
                    'message' => 'Domain verified successfully',
                    'data' => $customDomain->fresh()
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Domain verification failed. Please check your DNS configuration.'
                ], 422);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify domain',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get domain by name (for public access)
     */
    public function getByDomain(Request $request): JsonResponse
    {
        try {
            $domain = $request->input('domain');
            
            if (!$domain) {
                return response()->json([
                    'success' => false,
                    'message' => 'Domain parameter is required'
                ], 400);
            }

            $customDomain = CustomDomain::where('domain', $domain)
                ->where('is_active', true)
                ->where('verification_status', 'verified')
                ->with('landingPage')
                ->first();

            if (!$customDomain) {
                return response()->json([
                    'success' => false,
                    'message' => 'Domain not found or not active'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $customDomain
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch domain',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clean domain name
     */
    private function cleanDomainName(string $domain): string
    {
        // Remove protocol
        $domain = preg_replace('/^https?:\/\//', '', $domain);
        
        // Remove www
        $domain = preg_replace('/^www\./', '', $domain);
        
        // Remove trailing slash
        $domain = rtrim($domain, '/');
        
        // Convert to lowercase
        $domain = strtolower($domain);
        
        return $domain;
    }

    /**
     * Check DNS configuration (placeholder)
     */
    private function checkDnsConfiguration(string $domain): bool
    {
        // TODO: Implement actual DNS checking
        // This would typically involve:
        // 1. DNS lookup to check A record or CNAME
        // 2. Verify it points to your server IP
        // 3. Check for proper SSL certificate
        
        // For now, return true for demo purposes
        return true;
    }
}