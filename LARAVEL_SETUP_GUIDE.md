# Complete Laravel Backend Setup & Data Storage Guide

## 📋 **Overview**
This guide explains how to store your drag-and-drop landing page builder data in Laravel, including where to add POST APIs and the complete data flow process.

---

## 🗄️ **1. Database Setup Process**

### **Step 1: Create Laravel Project**
```bash
composer create-project laravel/laravel landing-page-builder
cd landing-page-builder
```

### **Step 2: Configure Database (.env file)**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=landing_page_builder
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### **Step 3: Create Migrations**
```bash
# Create migrations for our 3 main tables
php artisan make:migration create_landing_pages_table
php artisan make:migration create_section_types_table  
php artisan make:migration create_orders_table
```

### **Step 4: Run Migrations**
```bash
php artisan migrate
```

---

## 🎯 **2. Where to Add POST APIs**

### **Location 1: Routes (routes/api.php)**
This is where you define your API endpoints:

```php
<?php
use App\Http\Controllers\Api\PageBuilderController;
use App\Http\Controllers\Api\OrderController;

// Page Builder Routes
Route::prefix('page-builder')->group(function () {
    Route::get('/sections', [PageBuilderController::class, 'getSections']);
    Route::post('/{id?}', [PageBuilderController::class, 'savePage']); // ← POST API HERE
});

// Order Routes  
Route::post('/order', [OrderController::class, 'store']); // ← POST API HERE
Route::post('/orders', [OrderController::class, 'store']); // Alternative endpoint
```

### **Location 2: Controllers (app/Http/Controllers/Api/)**
This is where you handle the POST request logic:

**PageBuilderController.php** - Handles saving landing pages
**OrderController.php** - Handles saving orders

---

## 📊 **3. Data Storage Process Flow**

### **Process A: Saving Landing Page Data**

```
Frontend (Next.js) → Laravel API → Database
     ↓                    ↓           ↓
1. User drags sections   2. POST      3. Store in
2. Clicks "Save"         /api/page-   landing_pages
3. Send JSON data        builder      table
```

**Frontend Code (services/apiService.js):**
```javascript
const savePage = async (pageId, pageData) => {
  const url = pageId ? 
    `${API_BASE_URL}/page-builder/${pageId}` : 
    `${API_BASE_URL}/page-builder`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'My Landing Page',
      sections: [
        {
          id: 'section-1',
          type: 'hero',
          data: {
            title: 'Welcome',
            subtitle: 'Great products'
          }
        }
      ]
    })
  });
  
  return response.json();
};
```

**Laravel Controller Method:**
```php
public function savePage(Request $request, $id = null)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'sections' => 'required|array',
    ]);

    if ($id) {
        // Update existing page
        $page = LandingPage::findOrFail($id);
        $page->update($validated);
    } else {
        // Create new page
        $page = LandingPage::create($validated);
    }

    return response()->json([
        'success' => true,
        'data' => $page
    ]);
}
```

### **Process B: Saving Order Data**

```
Frontend Form → Laravel API → Database
     ↓              ↓           ↓
1. User fills      2. POST      3. Store in
   order form      /api/order   orders table
2. Clicks submit   
3. Send form data  
```

**Frontend Code (OrderFormSection.jsx):**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const response = await fetch('/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      address: '123 Main St',
      phone: '555-1234',
      total_price: 199.99
    })
  });
  
  const result = await response.json();
};
```

**Laravel Controller Method:**
```php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'address' => 'required|string',
        'phone' => 'nullable|string|max:20',
        'total_price' => 'nullable|numeric|min:0'
    ]);

    $order = Order::create($validated);

    return response()->json([
        'success' => true,
        'message' => 'Order created successfully',
        'data' => $order
    ], 201);
}
```

---

## 🔧 **4. Complete Implementation Steps**

### **Step 1: Create Models**
```bash
php artisan make:model LandingPage
php artisan make:model SectionType  
php artisan make:model Order
```

### **Step 2: Create Controllers**
```bash
php artisan make:controller Api/PageBuilderController
php artisan make:controller Api/OrderController
```

### **Step 3: Add Model Properties**
In each model, define fillable fields:

```php
// app/Models/LandingPage.php
protected $fillable = ['title', 'sections', 'slug', 'status'];
protected $casts = ['sections' => 'array'];

// app/Models/Order.php  
protected $fillable = ['name', 'email', 'address', 'phone', 'total_price'];
```

### **Step 4: Add Controller Methods**
Copy the controller methods from the provided files.

### **Step 5: Define API Routes**
Add routes in `routes/api.php`.

### **Step 6: Configure CORS**
Create CORS middleware to allow Next.js requests:

```php
// app/Http/Middleware/Cors.php
public function handle(Request $request, Closure $next)
{
    $response = $next($request);
    $response->headers->set('Access-Control-Allow-Origin', '*');
    $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return $response;
}
```

### **Step 7: Update Frontend**
Replace mock API calls with real Laravel endpoints:

```javascript
// services/apiService.js
const API_BASE_URL = 'http://localhost:8000/api'; // Your Laravel URL

export const apiService = {
  savePage: async (pageId, pageData) => {
    const url = pageId ? 
      `${API_BASE_URL}/page-builder/${pageId}` : 
      `${API_BASE_URL}/page-builder`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pageData)
    });
    
    return response.json();
  },

  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    return response.json();
  }
};
```

---

## 🚀 **5. Testing Your Setup**

### **Start Laravel Server:**
```bash
php artisan serve
# Server runs on http://localhost:8000
```

### **Test POST Endpoints:**

**Test Page Builder API:**
```bash
curl -X POST http://localhost:8000/api/page-builder \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Page",
    "sections": [
      {
        "id": "section-1",
        "type": "hero", 
        "data": {"title": "Welcome"}
      }
    ]
  }'
```

**Test Order API:**
```bash
curl -X POST http://localhost:8000/api/order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com", 
    "address": "123 Main St",
    "total_price": 199.99
  }'
```

---

## 📊 **6. Database Tables Structure**

### **landing_pages table:**
- `id` - Primary key
- `title` - Page title
- `sections` - JSON data of all sections
- `slug` - SEO-friendly URL
- `status` - draft/published
- `created_at`, `updated_at`

### **orders table:**
- `id` - Primary key  
- `name` - Customer name
- `email` - Customer email
- `address` - Shipping address
- `phone` - Phone number
- `total_price` - Order total
- `status` - pending/processing/shipped/delivered
- `order_number` - Unique order ID
- `created_at`, `updated_at`

### **section_types table:**
- `id` - Primary key
- `type` - Section type (hero, product_showcase, etc.)
- `name` - Display name
- `description` - Section description
- `icon` - Bootstrap icon class
- `default_data` - JSON default content
- `is_active` - Enable/disable section
- `created_at`, `updated_at`

---

## ✅ **7. Verification Checklist**

- [ ] Laravel project created
- [ ] Database configured in .env
- [ ] Migrations created and run
- [ ] Models created with fillable fields
- [ ] Controllers created with POST methods
- [ ] API routes defined
- [ ] CORS middleware configured
- [ ] Frontend updated to use real APIs
- [ ] Laravel server running on port 8000
- [ ] Next.js app connecting to Laravel APIs

---

This complete setup allows your Next.js frontend to store landing page configurations and order data in a robust Laravel backend with proper validation, error handling, and database relationships.