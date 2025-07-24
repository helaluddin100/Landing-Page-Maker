<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Section;
use App\Models\LandingPage;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some sample landing pages first if they don't exist
        $page1 = LandingPage::firstOrCreate(
            ['slug' => 'sample-landing-page'],
            [
                'title' => 'Sample Landing Page',
                'sections' => [],
                'status' => 'published',
                'meta_description' => 'Sample landing page for testing'
            ]
        );

        $page2 = LandingPage::firstOrCreate(
            ['slug' => 'product-launch-page'],
            [
                'title' => 'Product Launch Page',
                'sections' => [],
                'status' => 'draft',
                'meta_description' => 'Product launch landing page'
            ]
        );

        // Create sample sections
        $sections = [
            [
                'landing_page_id' => $page1->id,
                'section_id' => 'hero-section-1',
                'type' => 'hero',
                'data' => [
                    'title' => 'Welcome to Our Amazing Store',
                    'subtitle' => 'Discover premium products at unbeatable prices',
                    'primaryButtonText' => 'Shop Now',
                    'secondaryButtonText' => 'Learn More',
                    'image' => 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600'
                ],
                'sort_order' => 1,
                'is_active' => true
            ],
            [
                'landing_page_id' => $page1->id,
                'section_id' => 'products-section-1',
                'type' => 'product_showcase',
                'data' => [
                    'title' => 'Featured Products',
                    'subtitle' => 'Check out our best-selling items'
                ],
                'sort_order' => 2,
                'is_active' => true
            ],
            [
                'landing_page_id' => $page1->id,
                'section_id' => 'testimonials-section-1',
                'type' => 'testimonial',
                'data' => [
                    'title' => 'What Our Customers Say',
                    'subtitle' => 'Real reviews from real customers'
                ],
                'sort_order' => 3,
                'is_active' => true
            ],
            [
                'landing_page_id' => $page1->id,
                'section_id' => 'cta-section-1',
                'type' => 'cta',
                'data' => [
                    'title' => 'Ready to Get Started?',
                    'subtitle' => 'Join thousands of satisfied customers today',
                    'primaryButtonText' => 'Get Started',
                    'secondaryButtonText' => 'Learn More'
                ],
                'sort_order' => 4,
                'is_active' => true
            ],
            [
                'landing_page_id' => $page2->id,
                'section_id' => 'hero-section-2',
                'type' => 'hero',
                'data' => [
                    'title' => 'Revolutionary New Product',
                    'subtitle' => 'Experience the future today',
                    'primaryButtonText' => 'Pre-Order Now',
                    'secondaryButtonText' => 'Learn More'
                ],
                'sort_order' => 1,
                'is_active' => true
            ],
            [
                'landing_page_id' => $page2->id,
                'section_id' => 'product-details-section-1',
                'type' => 'product_details',
                'data' => [
                    'title' => 'Premium Wireless Headphones',
                    'price' => '$199.99',
                    'description' => 'Experience crystal-clear audio with premium features',
                    'buttonText' => 'Pre-Order Now'
                ],
                'sort_order' => 2,
                'is_active' => true
            ],
            [
                'landing_page_id' => $page2->id,
                'section_id' => 'newsletter-section-1',
                'type' => 'newsletter',
                'data' => [
                    'title' => 'Stay Updated',
                    'subtitle' => 'Get notified when we launch',
                    'buttonText' => 'Subscribe'
                ],
                'sort_order' => 3,
                'is_active' => false
            ]
        ];

        foreach ($sections as $sectionData) {
            Section::updateOrCreate(
                [
                    'section_id' => $sectionData['section_id'],
                    'landing_page_id' => $sectionData['landing_page_id']
                ],
                $sectionData
            );
        }
    }
}