<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * Store a new order
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'address' => 'required|string',
                'phone' => 'nullable|string|max:20',
                'total_price' => 'nullable|numeric|min:0',
                'order_items' => 'nullable|array',
                'notes' => 'nullable|string|max:1000'
            ]);

            $order = Order::create($validated);

            // You can add email notification here
            // Mail::to($order->email)->send(new OrderConfirmation($order));

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => $order
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all orders
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Order::query();
            
            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            // Search by email or name if provided
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('email', 'like', '%' . $search . '%')
                      ->orWhere('order_number', 'like', '%' . $search . '%');
                });
            }
            
            // Date range filter
            if ($request->has('date_from')) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }
            
            if ($request->has('date_to')) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }
            
            $orders = $query->orderBy('created_at', 'desc')->paginate(15);
            
            return response()->json([
                'success' => true,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific order
     */
    public function show(Order $order): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update order status
     */
    public function update(Request $request, Order $order): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => ['sometimes', Rule::in(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])],
                'total_price' => 'sometimes|numeric|min:0',
                'notes' => 'sometimes|nullable|string|max:1000',
                'order_items' => 'sometimes|nullable|array'
            ]);

            $order->update($validated);

            // Handle status-specific actions
            if (isset($validated['status'])) {
                switch ($validated['status']) {
                    case 'shipped':
                        $order->markAsShipped();
                        break;
                    case 'delivered':
                        $order->markAsDelivered();
                        break;
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Order updated successfully',
                'data' => $order->fresh()
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an order
     */
    public function destroy(Order $order): JsonResponse
    {
        try {
            $order->delete();

            return response()->json([
                'success' => true,
                'message' => 'Order deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get order statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_orders' => Order::count(),
                'pending_orders' => Order::pending()->count(),
                'processing_orders' => Order::processing()->count(),
                'shipped_orders' => Order::shipped()->count(),
                'delivered_orders' => Order::delivered()->count(),
                'total_revenue' => Order::delivered()->sum('total_price'),
                'average_order_value' => Order::delivered()->avg('total_price'),
                'orders_today' => Order::whereDate('created_at', today())->count(),
                'orders_this_month' => Order::whereMonth('created_at', now()->month)->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}