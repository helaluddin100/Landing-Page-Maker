// Next.js API route - Mock Laravel endpoint
// This simulates the Laravel POST /api/order endpoint

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, address, phone, total_price } = req.body

  // Validate required fields
  if (!name || !email || !address) {
    return res.status(400).json({ 
      message: 'Missing required fields',
      errors: {
        name: !name ? 'Name is required' : null,
        email: !email ? 'Email is required' : null,
        address: !address ? 'Address is required' : null
      }
    })
  }

  // Simulate processing delay
  setTimeout(() => {
    // Mock successful order creation
    const order = {
      id: Math.floor(Math.random() * 10000),
      name,
      email,
      address,
      phone: phone || null,
      total_price: total_price || 0,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('Order created:', order)

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    })
  }, 1000)
}

/*
Laravel Backend Implementation:

1. Create Migration:
```bash
php artisan make:migration create_orders_table
```

```php
// database/migrations/xxxx_xx_xx_create_orders_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->text('address');
            $table->string('phone')->nullable();
            $table->decimal('total_price', 10, 2)->default(0);
            $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
```

2. Create Model:
```bash
php artisan make:model Order
```

```php
// app/Models/Order.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'address',
        'phone',
        'total_price',
        'status'
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
}
```

3. Create Controller:
```bash
php artisan make:controller OrderController
```

```php
// app/Http/Controllers/OrderController.php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'total_price' => 'nullable|numeric|min:0'
        ]);

        try {
            $order = Order::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => $order
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(): JsonResponse
    {
        $orders = Order::latest()->paginate(15);
        
        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    public function update(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:pending,processing,shipped,delivered,cancelled',
            'total_price' => 'sometimes|numeric|min:0'
        ]);

        $order->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Order updated successfully',
            'data' => $order
        ]);
    }
}
```

4. Add Routes:
```php
// routes/api.php
use App\Http\Controllers\OrderController;

Route::post('/order', [OrderController::class, 'store']);
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/order/{order}', [OrderController::class, 'show']);
Route::put('/order/{order}', [OrderController::class, 'update']);
```

5. Run Migration:
```bash
php artisan migrate
```
*/