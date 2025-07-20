// Real Laravel API Service
// Replace your mockApiService.js with this file to connect to Laravel backend

const API_BASE_URL = 'http://localhost:8000/api'; // Your Laravel server URL

export const apiService = {
  // ==========================================
  // PAGE BUILDER APIs
  // ==========================================

  /**
   * Get all available section types from Laravel
   * Endpoint: GET /api/page-builder/sections
   */
  getSections: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/page-builder/sections`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data; // Laravel returns section types array directly
    } catch (error) {
      console.error('Error fetching sections:', error);
      throw error;
    }
  },

  /**
   * Get a specific landing page by ID
   * Endpoint: GET /api/page-builder/{id}
   */
  getPage: async (pageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/page-builder/${pageId}`, {
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
      return result.data; // Laravel wraps data in 'data' property
    } catch (error) {
      console.error('Error fetching page:', error);
      throw error;
    }
  },

  /**
   * Save or update a landing page
   * Endpoint: POST /api/page-builder/{id?}
   */
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

  /**
   * Get all landing pages
   * Endpoint: GET /api/page-builder/pages
   */
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

  /**
   * Delete a landing page
   * Endpoint: DELETE /api/page-builder/{id}
   */
  deletePage: async (pageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/page-builder/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  },

  // ==========================================
  // ORDER APIs
  // ==========================================

  /**
   * Create a new order
   * Endpoint: POST /api/order
   */
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: orderData.name,
          email: orderData.email,
          address: orderData.address,
          phone: orderData.phone || null,
          total_price: orderData.total_price || 0,
          order_items: orderData.order_items || null,
          notes: orderData.notes || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Get all orders
   * Endpoint: GET /api/orders
   */
  getOrders: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.date_from) queryParams.append('date_from', filters.date_from);
      if (filters.date_to) queryParams.append('date_to', filters.date_to);
      
      const url = `${API_BASE_URL}/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
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
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  /**
   * Get order statistics
   * Endpoint: GET /api/orders/statistics
   */
  getOrderStatistics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/statistics`, {
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
      console.error('Error fetching order statistics:', error);
      throw error;
    }
  },

  /**
   * Update order status
   * Endpoint: PUT /api/orders/{id}
   */
  updateOrder: async (orderId, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }
};

// ==========================================
// USAGE EXAMPLES
// ==========================================

/*
// Example 1: Save a landing page
const pageData = {
  title: 'My Awesome Landing Page',
  sections: [
    {
      id: 'hero-1',
      type: 'hero',
      data: {
        title: 'Welcome to Our Store',
        subtitle: 'Amazing products await'
      }
    },
    {
      id: 'products-1', 
      type: 'product_showcase',
      data: {
        title: 'Featured Products'
      }
    }
  ]
};

apiService.savePage(null, pageData)
  .then(result => console.log('Page saved:', result))
  .catch(error => console.error('Save failed:', error));

// Example 2: Create an order
const orderData = {
  name: 'John Doe',
  email: 'john@example.com',
  address: '123 Main Street, City, State 12345',
  phone: '555-123-4567',
  total_price: 299.99
};

apiService.createOrder(orderData)
  .then(result => console.log('Order created:', result))
  .catch(error => console.error('Order failed:', error));

// Example 3: Load a page
apiService.getPage(1)
  .then(page => console.log('Page loaded:', page))
  .catch(error => console.error('Load failed:', error));
*/