<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SectionType;

class SectionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sectionTypes = [
            [
                'type' => 'hero',
                'name' => 'Hero Banner',
                'description' => 'Eye-catching header section',
                'icon' => 'bi-star',
                'thumbnail' => '/thumbnails/hero.jpg',
                'default_data' => [
                    'title' => 'Welcome to Our Amazing Store',
                    'subtitle' => 'Discover premium products at unbeatable prices',
                    'primaryButtonText' => 'Shop Now',
                    'secondaryButtonText' => 'Learn More',
                    'image' => 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600'
                ],
                'sort_order' => 1
            ],
            [
                'type' => 'product_showcase',
                'name' => 'Product Showcase',
                'description' => 'Display featured products',
                'icon' => 'bi-grid',
                'thumbnail' => '/thumbnails/products.jpg',
                'default_data' => [
                    'title' => 'Featured Products',
                    'subtitle' => 'Discover our best-selling items'
                ],
                'sort_order' => 2
            ],
            [
                'type' => 'product_details',
                'name' => 'Product Details',
                'description' => 'Detailed product showcase',
                'icon' => 'bi-box-seam',
                'thumbnail' => '/thumbnails/product-details.jpg',
                'default_data' => [
                    'title' => 'Premium Wireless Headphones',
                    'price' => '$199.99',
                    'description' => 'Experience crystal-clear audio with premium features',
                    'buttonText' => 'Add to Cart'
                ],
                'sort_order' => 3
            ],
            [
                'type' => 'testimonial',
                'name' => 'Testimonials',
                'description' => 'Customer reviews and feedback',
                'icon' => 'bi-chat-quote',
                'thumbnail' => '/thumbnails/testimonials.jpg',
                'default_data' => [
                    'title' => 'What Our Customers Say',
                    'subtitle' => 'Real reviews from real customers'
                ],
                'sort_order' => 4
            ],
            [
                'type' => 'feature_grid',
                'name' => 'Feature Grid',
                'description' => 'Highlight key features',
                'icon' => 'bi-grid-3x3',
                'thumbnail' => '/thumbnails/features.jpg',
                'default_data' => [
                    'title' => 'Why Choose Us',
                    'subtitle' => 'Discover what makes us special'
                ],
                'sort_order' => 5
            ],
            [
                'type' => 'image_text',
                'name' => 'Image + Text',
                'description' => 'Content section with image',
                'icon' => 'bi-image',
                'thumbnail' => '/thumbnails/image-text.jpg',
                'default_data' => [
                    'title' => 'About Our Company',
                    'content' => 'We are dedicated to providing the best products and services to our customers.',
                    'buttonText' => 'Learn More',
                    'imagePosition' => 'left'
                ],
                'sort_order' => 6
            ],
            [
                'type' => 'cta',
                'name' => 'Call to Action',
                'description' => 'Conversion-focused section',
                'icon' => 'bi-megaphone',
                'thumbnail' => '/thumbnails/cta.jpg',
                'default_data' => [
                    'title' => 'Ready to Get Started?',
                    'subtitle' => 'Join thousands of satisfied customers today',
                    'primaryButtonText' => 'Get Started',
                    'secondaryButtonText' => 'Learn More'
                ],
                'sort_order' => 7
            ],
            [
                'type' => 'newsletter',
                'name' => 'Newsletter Signup',
                'description' => 'Email subscription form',
                'icon' => 'bi-envelope',
                'thumbnail' => '/thumbnails/newsletter.jpg',
                'default_data' => [
                    'title' => 'Stay Updated',
                    'subtitle' => 'Subscribe to our newsletter for the latest updates',
                    'buttonText' => 'Subscribe'
                ],
                'sort_order' => 8
            ],
            [
                'type' => 'order_form',
                'name' => 'Order Form',
                'description' => 'Customer order submission',
                'icon' => 'bi-clipboard-check',
                'thumbnail' => '/thumbnails/order-form.jpg',
                'default_data' => [
                    'title' => 'Place Your Order',
                    'subtitle' => 'Fill out the form below to complete your purchase',
                    'buttonText' => 'Submit Order'
                ],
                'sort_order' => 9
            ]
        ];

        foreach ($sectionTypes as $sectionType) {
            SectionType::updateOrCreate(
                ['type' => $sectionType['type']],
                $sectionType
            );
        }
    }
}