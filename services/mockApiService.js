import { sectionTypes } from '../data/sectionTypes'
const API_BASE_URL = 'http://localhost:8000/api';

// Mock API service that simulates Laravel backend
export const mockApiService = {
  // GET /api/sections
  getSections: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return sectionTypes
  },

  // GET /api/page-builder/slug/{slug}
  getPageBySlug: async (slug) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock pages database
    const mockPages = [
      {
        id: 1,
        title: 'My Landing Page',
        slug: 'my-landing-page',
        status: 'published',
        meta_description: 'Amazing landing page for our products',
        meta_keywords: 'landing, page, products',
        sections: [
          {
            id: 'section-1',
            type: 'hero',
            data: {
              title: 'Welcome to Our Amazing Store',
              subtitle: 'Discover premium products at unbeatable prices',
              primaryButtonText: 'Shop Now',
              secondaryButtonText: 'Learn More',
              image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600'
            }
          },
          {
            id: 'section-2',
            type: 'product_showcase',
            data: {
              title: 'Featured Products',
              subtitle: 'Check out our best sellers'
            }
          }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Product Launch Page',
        slug: 'product-launch',
        status: 'published',
        meta_description: 'Exciting new product launch',
        meta_keywords: 'product, launch, new',
        sections: [
          {
            id: 'section-1',
            type: 'hero',
            data: {
              title: 'Revolutionary New Product',
              subtitle: 'Experience the future today',
              primaryButtonText: 'Pre-Order Now',
              secondaryButtonText: 'Learn More'
            }
          }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    const page = mockPages.find(p => p.slug === slug)
    if (!page) {
      throw new Error('Page not found')
    }

    return page
  },
  // GET /api/page-builder/{id}
  getPage: async (pageId) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    // Return mock page data
    const mockPage = {
      id: pageId,
      title: 'My Landing Page',
      slug: 'my-landing-page',
      status: 'draft',
      meta_description: 'Amazing landing page for our products',
      meta_keywords: 'landing, page, products',
      sections: [
        {
          id: 'section-1',
          type: 'hero',
          data: {
            title: 'Welcome to Our Amazing Store',
            subtitle: 'Discover premium products at unbeatable prices',
            primaryButtonText: 'Shop Now',
            secondaryButtonText: 'Learn More',
            image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600'

          }
        },
        {
          id: 'section-2',
          type: 'product_showcase',
          data: {
            title: 'Featured Products',
            subtitle: 'Check out our best sellers'
          }
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return mockPage
  },



  savePage: async (pageId, pageData) => {
    try {
      const url = pageId ?
        `${API_BASE_URL}/page-builder/${pageId}` :
        `${API_BASE_URL}/page-builder`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          title: pageData.title || 'My Landing Page',
          sections: pageData.sections || [],
          status: pageData.status || 'draft',
          meta_description: pageData.meta_description || '',
          meta_keywords: pageData.meta_keywords || ''
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error saving page:', error);
      throw error;
    }
  },


  getPages: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.status) queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);

      const url = `${API_BASE_URL}/page-builder/pages${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching pages:', error);
      // Return mock data for development
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        data: [
          {
            id: 1,
            title: 'My Landing Page',
            slug: 'my-landing-page',
            status: 'published',
            meta_description: 'Amazing landing page for our products',
            meta_keywords: 'landing, page, products',
            sections: [{ id: 'section-1', type: 'hero' }],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            title: 'Product Launch Page',
            slug: 'product-launch',
            status: 'draft',
            meta_description: 'Exciting new product launch',
            meta_keywords: 'product, launch, new',
            sections: [{ id: 'section-1', type: 'hero' }],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      }
    }
  },

  // Update page metadata
  updatePageMeta: async (pageId, pageData) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Updating page meta:', pageId, pageData)
    return { success: true, message: 'Page updated successfully' }
  },

  // Delete page
  deletePage: async (pageId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Deleting page:', pageId)
    return { success: true, message: 'Page deleted successfully' }
  },

  // Duplicate page
  duplicatePage: async (pageId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Duplicating page:', pageId)
    return { success: true, message: 'Page duplicated successfully' }
  },

  // ==========================================
  // CUSTOM DOMAINS APIs
  // ==========================================

  // Get all domains
  getDomains: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      {
        id: 1,
        domain: 'example.com',
        page_id: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        domain: 'mystore.com',
        page_id: 2,
        is_active: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  },

  // Create domain
  createDomain: async (domainData) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Creating domain:', domainData)
    return { success: true, message: 'Domain created successfully' }
  },

  // Update domain
  updateDomain: async (domainId, domainData) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Updating domain:', domainId, domainData)
    return { success: true, message: 'Domain updated successfully' }
  },

  // Delete domain
  deleteDomain: async (domainId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Deleting domain:', domainId)
    return { success: true, message: 'Domain deleted successfully' }
  },

  // ==========================================
  // SECTION MANAGEMENT APIs
  // ==========================================


  // Get section types
  getSectionTypes: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [
      { type: 'hero', name: 'Hero Section' },
      { type: 'product_showcase', name: 'Product Showcase' },
      { type: 'testimonial', name: 'Testimonials' },
      { type: 'cta', name: 'Call to Action' },
      { type: 'newsletter', name: 'Newsletter' },
      { type: 'feature_grid', name: 'Feature Grid' },
      { type: 'image_text', name: 'Image + Text' },
      { type: 'product_details', name: 'Product Details' },
      { type: 'order_form', name: 'Order Form' }
    ]
  },

  // Create section
  createSection: async (sectionData) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Creating section:', sectionData)
    return { success: true, message: 'Section created successfully' }
  },

  // Update section
  updateSection: async (sectionId, sectionData) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Updating section:', sectionId, sectionData)
    return { success: true, message: 'Section updated successfully' }
  },

  // Delete section
  deleteSection: async (sectionId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Deleting section:', sectionId)
    return { success: true, message: 'Section deleted successfully' }
  },

  // Duplicate section
  duplicateSection: async (sectionId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Duplicating section:', sectionId)
    return { success: true, message: 'Section duplicated successfully' }
  },

  // Toggle section status
  toggleSectionStatus: async (sectionId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Toggling section status:', sectionId)
    return { success: true, message: 'Section status updated successfully' }
  },

  // Update section order
  updateSectionOrder: async (sections) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Updating section order:', sections)
    return { success: true, message: 'Section order updated successfully' }
  },

  // Get section statistics

}