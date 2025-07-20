# Frontend Update Instructions

## 🔄 **How to Connect Your Frontend to Laravel Backend**

Follow these steps to replace the mock API service with real Laravel API calls:

---

## **Step 1: Update API Service**

Replace your current `services/mockApiService.js` with the real API service:

```javascript
// In your Next.js project, update this file:
// services/mockApiService.js → services/apiService.js

// Copy the content from realApiService.js (provided above)
```

---

## **Step 2: Update Frontend Components**

### **Update pages/index.js:**

```javascript
// Change this import:
import { mockApiService } from '../services/mockApiService'

// To this:
import { apiService } from '../services/apiService'

// Then update all function calls:
const loadAvailableSections = async () => {
  try {
    const data = await apiService.getSections() // Changed from mockApiService
    setAvailableSections(data)
  } catch (error) {
    console.error('Error loading sections:', error)
  }
}

const loadPage = async () => {
  try {
    setLoading(true)
    const data = await apiService.getPage(pageId) // Changed from mockApiService
    setSections(data.sections || [])
  } catch (error) {
    console.error('Error loading page:', error)
  } finally {
    setLoading(false)
  }
}

const savePage = async () => {
  try {
    setLoading(true)
    await apiService.savePage(pageId, { sections }) // Changed from mockApiService
    alert('Page saved successfully!')
  } catch (error) {
    console.error('Error saving page:', error)
    alert('Error saving page')
  } finally {
    setLoading(false)
  }
}
```

### **Update OrderFormSection.jsx:**

```javascript
// In components/sections/OrderFormSection.jsx
// Update the handleSubmit function:

const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setMessage({ type: '', text: '' })

  try {
    // Use real API instead of fetch to /api/order
    const response = await apiService.createOrder({
      ...formData,
      total_price: 199.99 // Mock total price
    })

    if (response.success) {
      setMessage({ 
        type: 'success', 
        text: 'Order submitted successfully! We will contact you soon.' 
      })
      setFormData({ name: '', email: '', address: '', phone: '' })
    } else {
      throw new Error(response.message || 'Failed to submit order')
    }
  } catch (error) {
    console.error('Order submission error:', error)
    setMessage({ 
      type: 'danger', 
      text: error.message || 'Failed to submit order. Please try again.' 
    })
  } finally {
    setLoading(false)
  }
}
```

---

## **Step 3: Configure API Base URL**

In your `services/apiService.js`, update the base URL to match your Laravel server:

```javascript
// Update this line to match your Laravel server:
const API_BASE_URL = 'http://localhost:8000/api'; // Default Laravel serve port

// Or if you're using a different port:
// const API_BASE_URL = 'http://localhost:8080/api';
// const API_BASE_URL = 'https://yourdomain.com/api'; // For production
```

---

## **Step 4: Handle CORS (if needed)**

If you get CORS errors, make sure your Laravel backend has CORS middleware configured:

### **Option A: Add to Laravel Kernel.php**
```php
// app/Http/Kernel.php
protected $middleware = [
    // ... other middleware
    \App\Http\Middleware\Cors::class,
];
```

### **Option B: Use Laravel Sanctum**
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

---

## **Step 5: Test the Connection**

1. **Start Laravel server:**
   ```bash
   cd your-laravel-project
   php artisan serve
   # Server runs on http://localhost:8000
   ```

2. **Start Next.js development server:**
   ```bash
   cd your-nextjs-project
   npm run dev
   # App runs on http://localhost:3000
   ```

3. **Test functionality:**
   - Drag sections to canvas
   - Click "Save Page" - should save to Laravel database
   - Fill out order form - should create order in Laravel database
   - Check Laravel database to confirm data is stored

---

## **Step 6: Verify Database Storage**

Check your Laravel database to see the stored data:

```sql
-- Check landing pages
SELECT * FROM landing_pages;

-- Check orders  
SELECT * FROM orders;

-- Check section types
SELECT * FROM section_types;
```

---

## **Step 7: Error Handling**

Add proper error handling in your frontend:

```javascript
// Example error handling wrapper
const handleApiCall = async (apiFunction, successMessage, errorMessage) => {
  try {
    setLoading(true)
    const result = await apiFunction()
    
    if (result.success) {
      alert(successMessage)
      return result
    } else {
      throw new Error(result.message || errorMessage)
    }
  } catch (error) {
    console.error('API Error:', error)
    alert(error.message || errorMessage)
    throw error
  } finally {
    setLoading(false)
  }
}

// Usage:
const savePage = () => handleApiCall(
  () => apiService.savePage(pageId, { sections }),
  'Page saved successfully!',
  'Failed to save page'
)
```

---

## **🎯 Data Flow Summary**

```
Next.js Frontend → Laravel API → MySQL Database

1. User drags sections in Next.js
2. Clicks "Save" button  
3. Frontend calls apiService.savePage()
4. Laravel PageBuilderController receives POST request
5. Validates and stores data in landing_pages table
6. Returns success response to frontend
7. Frontend shows success message
```

This setup creates a complete full-stack application where your drag-and-drop landing page builder stores real data in a Laravel backend with MySQL database.