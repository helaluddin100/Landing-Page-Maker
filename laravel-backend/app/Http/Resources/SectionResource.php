<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'landing_page_id' => $this->landing_page_id,
            'section_id' => $this->section_id,
            'type' => $this->type,
            'data' => $this->data,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Include landing page info when loaded
            'landing_page' => $this->whenLoaded('landingPage', function () {
                return [
                    'id' => $this->landingPage->id,
                    'title' => $this->landingPage->title,
                    'slug' => $this->landingPage->slug,
                    'status' => $this->landingPage->status,
                ];
            }),
        ];
    }
}