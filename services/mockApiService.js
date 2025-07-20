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

  // GET /api/page-builder/{id}
  getPage: async (pageId) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    // Return mock page data
    const mockPage = {
      id: pageId,
      title: 'My Landing Page',
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
      throw error;
    }
  },
}