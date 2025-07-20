# Laravel Backend Setup Instructions

## 1. Installation Steps

### Create Laravel Project
```bash
composer create-project laravel/laravel landing-page-builder
cd landing-page-builder
```

### Copy Files
Copy all the files from the `laravel-backend` folder to your Laravel project root.

### Install Dependencies
```bash
composer install
```

### Environment Setup
```bash
cp .env.example .env
php artisan key:generate
```

### Configure Database
Edit your `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=landing_page_builder
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Run Migrations and Seeders
```bash
php artisan migrate
php artisan db:seed
```

## 2. CORS Configuration

### Option A: Add to Kernel.php
Add the CORS middleware to `app/Http/Kernel.php`:

```php
protected $middleware = [
    // ... other middleware
    \App\Http\Middleware\Cors::class,
];
```

### Option B: Use Laravel Sanctum (Recommended)
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

Add to `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000'], // Your Next.js URL
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => false,
```

## 3. API Endpoints

### Page Builder Endpoints
- `GET /api/page-builder/sections` - Get all section types
- `GET /api/page-builder/pages` - Get all landing pages
- `GET /api/page-builder/{id}` - Get specific landing page
- `POST /api/page-builder/{id?}` - Create/update landing page
- `DELETE /api/page-builder/{id}` - Delete landing page
- `POST /api/page-builder/{id}/duplicate` - Duplicate landing page

### Order Endpoints
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{order}` - Get specific order
- `PUT /api/orders/{order}` - Update order
- `DELETE /api/orders/{order}` - Delete order
- `GET /api/orders/statistics` - Get order statistics

### Legacy Endpoint
- `POST /api/order` - Create order (for frontend compatibility)

## 4. Frontend Integration

Update your Next.js `services/mockApiService.js` to use real Laravel endpoints:

```javascript
const API_BASE_URL = 'http://localhost:8000/api'; // Your Laravel URL

export const apiService = {
  getSections: async () => {
    const response = await fetch(`${API_BASE_URL}/page-builder/sections`);
    return response.json();
  },

  getPage: async (pageId) => {
    const response = await fetch(`${API_BASE_URL}/page-builder/${pageId}`);
    const data = await response.json();
    return data.data;
  },

  savePage: async (pageId, pageData) => {
    const url = pageId ? 
      `${API_BASE_URL}/page-builder/${pageId}` : 
      `${API_BASE_URL}/page-builder`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageData)
    });
    
    return response.json();
  },

  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    
    return response.json();
  }
};
```

## 5. Running the Application

### Start Laravel Server
```bash
php artisan serve
```

### Start Queue Worker (Optional)
```bash
php artisan queue:work
```

## 6. Additional Features

### Email Notifications
To send order confirmation emails, install Laravel Mail:

```bash
# Configure mail in .env
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### File Storage
For image uploads, configure storage:

```bash
php artisan storage:link
```

### API Authentication (Optional)
For protected routes, add authentication:

```bash
composer require laravel/passport
php artisan passport:install
```

## 7. Production Deployment

### Optimize for Production
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer install --optimize-autoloader --no-dev
```

### Environment Variables
Set production environment variables:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
```

## 8. Database Schema Overview

### landing_pages
- Stores page configurations with JSON sections
- Supports SEO metadata and status management
- Automatic slug generation

### section_types
- Defines available section types for the page builder
- Includes default data and display information
- Sortable and toggleable

### orders
- Complete order management system
- Status tracking and timestamps
- JSON storage for order items

This setup provides a complete backend for your drag-and-drop landing page builder with order management capabilities.