export const sectionTypes = [
  {
    id: 'hero-1',
    type: 'hero',
    name: 'Hero Banner',
    description: 'Eye-catching header section',
    icon: 'bi-star',
    thumbnail: '/thumbnails/hero.jpg',
    defaultData: {
      title: 'Welcome to Our Amazing Store',
      subtitle: 'Discover premium products at unbeatable prices',
      primaryButtonText: 'Shop Now',
      secondaryButtonText: 'Learn More',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  },
  {
    id: 'products-1',
    type: 'product_showcase',
    name: 'Product Showcase',
    description: 'Display featured products',
    icon: 'bi-grid',
    thumbnail: '/thumbnails/products.jpg',
    defaultData: {
      title: 'Featured Products',
      subtitle: 'Discover our best-selling items'
    }
  },
  {
    id: 'testimonials-1',
    type: 'testimonial',
    name: 'Testimonials',
    description: 'Customer reviews and feedback',
    icon: 'bi-chat-quote',
    thumbnail: '/thumbnails/testimonials.jpg',
    defaultData: {
      title: 'What Our Customers Say',
      subtitle: 'Real reviews from real customers'
    }
  },
  {
    id: 'newsletter-1',
    type: 'newsletter',
    name: 'Newsletter Signup',
    description: 'Email subscription form',
    icon: 'bi-envelope',
    thumbnail: '/thumbnails/newsletter.jpg',
    defaultData: {
      title: 'Stay Updated',
      subtitle: 'Subscribe to our newsletter for the latest updates',
      buttonText: 'Subscribe'
    }
  },
  {
    id: 'image-text-1',
    type: 'image_text',
    name: 'Image + Text',
    description: 'Content section with image',
    icon: 'bi-image',
    thumbnail: '/thumbnails/image-text.jpg',
    defaultData: {
      title: 'About Our Company',
      content: 'We are dedicated to providing the best products and services to our customers.',
      buttonText: 'Learn More',
      imagePosition: 'left'
    }
  },
  {
    id: 'features-1',
    type: 'feature_grid',
    name: 'Feature Grid',
    description: 'Highlight key features',
    icon: 'bi-grid-3x3',
    thumbnail: '/thumbnails/features.jpg',
    defaultData: {
      title: 'Why Choose Us',
      subtitle: 'Discover what makes us special'
    }
  },
  {
    id: 'cta-1',
    type: 'cta',
    name: 'Call to Action',
    description: 'Conversion-focused section',
    icon: 'bi-megaphone',
    thumbnail: '/thumbnails/cta.jpg',
    defaultData: {
      title: 'Ready to Get Started?',
      subtitle: 'Join thousands of satisfied customers today',
      primaryButtonText: 'Get Started',
      secondaryButtonText: 'Learn More'
    }
  },
  {
    id: 'product-details-1',
    type: 'product_details',
    name: 'Product Details',
    description: 'Detailed product showcase',
    icon: 'bi-box-seam',
    thumbnail: '/thumbnails/product-details.jpg',
    defaultData: {
      title: 'Premium Wireless Headphones',
      price: '$199.99',
      description: 'Experience crystal-clear audio with premium features',
      buttonText: 'Add to Cart'
    }
  },
  {
    id: 'order-form-1',
    type: 'order_form',
    name: 'Order Form',
    description: 'Customer order submission',
    icon: 'bi-clipboard-check',
    thumbnail: '/thumbnails/order-form.jpg',
    defaultData: {
      title: 'Place Your Order',
      subtitle: 'Fill out the form below to complete your purchase',
      buttonText: 'Submit Order'
    }
  },
  {
    id: 'swiper-1',
    type: 'swiper_slider',
    name: 'Swiper Slider',
    description: 'Interactive image slider with navigation',
    icon: 'bi-images',
    thumbnail: '/thumbnails/swiper.jpg',
    defaultData: {
      slides: [
        {
          id: 1,
          title: 'Premium Quality Products',
          subtitle: 'Discover our exclusive collection',
          image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
          buttonText: 'Shop Now'
        }
      ]
    }
  }
]