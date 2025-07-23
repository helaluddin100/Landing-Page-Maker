<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LandingPageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'sections' => $this->sections,
            'slug' => $this->slug,
            'status' => $this->status,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Include sections when loaded
            'section_list' => SectionResource::collection($this->whenLoaded('sections')),
            'active_sections' => SectionResource::collection($this->whenLoaded('activeSections')),
        ];
    }
}