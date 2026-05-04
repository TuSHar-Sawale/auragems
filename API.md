# API Documentation

## Base URL
```
http://localhost:3000/api (development)
https://yourdomain.com/api (production)
```

---

## Authentication

All admin endpoints require Bearer token authentication:
```
Authorization: Bearer <supabase_jwt_token>
```

---

## Public Endpoints

### Products

#### GET /products
Fetch all products with optional filters

**Query Parameters:**
- `search` (string) - Search in name/description
- `category` (string) - Filter by category ID
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price
- `featured` (boolean) - Only featured products
- `page` (number, default: 1) - Page number
- `limit` (number, default: 12) - Items per page

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": "uuid",
      "name": "Diamond Ring",
      "price": 15000,
      "mrp": 18000,
      "description": "...",
      "stock": 50,
      "is_featured": true,
      "product_images": [
        {
          "id": "uuid",
          "image_url": "https://...",
          "is_primary": true
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100
  }
}
```

#### GET /products/[id]
Fetch single product details

**Response:**
```json
{
  "success": true,
  "product": { ... }
}
```

---

## Orders

### POST /orders/create-order
Create a new order

**Request Body:**
```json
{
  "items": [
    {
      "id": "product_id",
      "name": "Product Name",
      "price": 15000,
      "quantity": 1
    }
  ],
  "shipping": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address_line1": "123 Main St",
    "address_line2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "razorpay" | "cod",
  "totalAmount": 15000
}
```

**Response (Razorpay):**
```json
{
  "success": true,
  "id": "order_id",
  "order_number": "ORD-xxx",
  "razorpay_order_id": "order_xxxxxxxxx",
  "amount": 1500000
}
```

### POST /orders/verify-payment
Verify Razorpay payment

**Request Body:**
```json
{
  "order_id": "order_uuid",
  "razorpay_order_id": "order_xxxxxxxxx",
  "razorpay_payment_id": "pay_xxxxxxxxx",
  "razorpay_signature": "signature_hash"
}
```

**Response:**
```json
{
  "success": true,
  "order_id": "order_uuid",
  "order_number": "ORD-xxx",
  "message": "Payment verified successfully"
}
```

### GET /orders
Fetch user's orders (requires auth)

**Response:**
```json
{
  "success": true,
  "orders": [...]
}
```

### GET /orders/[id]
Fetch order details (requires auth)

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "order_number": "ORD-xxx",
    "total_amount": 15000,
    "order_status": "pending",
    "payment_status": "pending",
    "order_items": [...],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## Coupons

### POST /coupons/validate
Validate and get coupon details

**Request Body:**
```json
{
  "code": "WELCOME10",
  "cartTotal": 5000
}
```

**Response:**
```json
{
  "success": true,
  "coupon": {
    "code": "WELCOME10",
    "discount": 500,
    "discountType": "percentage",
    "description": "Welcome discount"
  }
}
```

---

## Admin Endpoints

All admin endpoints require Bearer token authentication and admin role.

### Products

#### POST /admin/products
Create new product

**Request Body:**
```json
{
  "name": "Diamond Ring",
  "description": "Beautiful diamond ring",
  "price": 15000,
  "mrp": 18000,
  "stock": 50,
  "sku": "RING-001",
  "category_id": "category_uuid",
  "brand": "AuraGems",
  "tags": ["luxury", "diamond"],
  "is_active": true,
  "is_featured": false,
  "is_new": true,
  "cod_available": true
}
```

#### PUT /admin/products/[id]
Update product

**Request Body:** Same as POST

#### DELETE /admin/products/[id]
Delete product

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### Orders

#### GET /admin/orders
Fetch all orders (admin only)

**Query Parameters:**
- `status` (string) - Filter by status (pending, confirmed, processing, shipped, delivered, cancelled)
- `page` (number, default: 1)
- `limit` (number, default: 20)

#### PUT /admin/orders/[id]/status
Update order status

**Request Body:**
```json
{
  "status": "shipped"
}
```

---

### Coupons

#### GET /admin/coupons
Fetch all coupons (admin only)

#### POST /admin/coupons
Create coupon

**Request Body:**
```json
{
  "code": "WELCOME10",
  "discount_type": "percentage" | "flat",
  "discount_value": 10,
  "min_order_amount": 1000,
  "max_discount": 500,
  "usage_limit": 100,
  "expiry_date": "2025-12-31",
  "description": "Welcome discount"
}
```

#### PUT /admin/coupons/[id]
Update coupon

#### DELETE /admin/coupons/[id]
Delete coupon

---

### Dashboard

#### GET /admin/dashboard
Get dashboard statistics

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalRevenue": 150000,
    "totalOrders": 45,
    "totalProducts": 150,
    "totalUsers": 200,
    "recentOrders": [...],
    "revenueChart": [
      {
        "date": "2024-01-01",
        "revenue": 25000
      }
    ]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized - valid token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden - admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

- Public endpoints: 60 requests per minute
- Authenticated endpoints: 100 requests per minute
- Admin endpoints: 50 requests per minute

---

## Examples

### JavaScript/Node.js
```javascript
// Fetch products
const response = await fetch('/api/products?category=rings&limit=10');
const data = await response.json();
console.log(data.products);

// Create order
const orderResponse = await fetch('/api/orders/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    items: [...],
    shipping: {...},
    paymentMethod: 'razorpay',
    totalAmount: 15000
  })
});
```

### cURL
```bash
# Get products
curl https://yourdomain.com/api/products?limit=10

# Create order
curl -X POST https://yourdomain.com/api/orders/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "shipping": {...},
    "paymentMethod": "razorpay",
    "totalAmount": 15000
  }'
```

---

## Webhooks (Future)

Razorpay webhooks for:
- Payment successful
- Payment failed
- Refund initiated
- Subscription changes

---

For more details, check the source code in the `/app/api` directory.
