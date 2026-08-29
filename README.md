# Grocery Store Web Application

A complete, production-style grocery store ecommerce platform built with the MERN Stack (MongoDB, Express, React, Node.js).

## Features

### Customer Features
- User registration and authentication
- Product browsing, search, and filtering
- Category-based filtering and price range filtering
- Shopping cart management
- Checkout with delivery address collection
- Customer delivery notes
- Payment via Online (mock) or Cash on Delivery (COD)
- Order tracking with real-time status updates
- Delivery OTP verification
- Weekly purchase tracking for delivery discounts
- Order history and order details
- Product request system (ask shop for unavailable items)
- Notification system for order updates

### Admin Features
- Product management (add, edit, delete, deactivate)
- Price and discount management
- Stock management
- Category management
- Order management with status updates
- Customer management
- Product request handling with replies
- Admin dashboard with key metrics
- Notification management

### Business Rules
- Minimum order value: ₹100 for delivery eligibility
- Weekly purchase tracking for customer incentives
- Dynamic delivery charge calculation based on weekly purchases
- Price calculation centralized on backend (not trusted from frontend)
- Delivery OTP verification for order completion

## Tech Stack

### Frontend
- React.js 18+
- React Router
- Axios
- Tailwind CSS
- Material UI (MUI)
- Context API (Authentication & Cart)
- JavaScript/JSX (No TypeScript)

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcrypt for password hashing
- ES Modules (import/export)

### Architecture
- **Backend**: MVC (Models, Views, Controllers)
- **Frontend**: Component-based with Context API

## Project Structure

```
grocery-store/
├── backend/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── theme/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── README.md
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/grocery-store
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000
```

## Installation & Setup

### Prerequisites
- Node.js 16+
- MongoDB 4.0+
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/Vinay99199/grocery-store.git
cd grocery-store
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:3000/admin

## API Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `POST /api/orders/:id/verify-otp` - Verify delivery OTP

### Product Requests
- `POST /api/product-requests` - Create product request
- `GET /api/product-requests` - Get requests (Admin)
- `POST /api/product-requests/:id/reply` - Reply to request (Admin)

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

## Important Business Rules

### Delivery Charge Calculation
```
Weekly Purchase < ₹120:
  - Order value < ₹100: Not eligible for delivery
  - Order value ≥ ₹100: ₹70 delivery charge

Weekly Purchase ≥ ₹120:
  - ₹50 delivery charge (regardless of order value)
```

### Price Calculation
```
Final Selling Price = MRP × (1 - Discount% / 100)
```
Price calculation is **centralized in backend** and never trusted from frontend.

### Order Status Flow
```
PLACED → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED
```
Orders can be CANCELLED at any stage before delivery.

### Payment Status
```
PENDING → PAID / FAILED / REFUNDED
```

## Development Stages

1. ✅ Project setup + Express + MongoDB + MVC
2. ⏳ Authentication
3. ⏳ Products + Categories
4. ⏳ Customer UI + Product browsing
5. ⏳ Cart system
6. ⏳ Checkout + Delivery rules
7. ⏳ Orders
8. ⏳ Admin dashboard
9. ⏳ Product requests
10. ⏳ Notifications
11. ⏳ Payment integration
12. ⏳ Delivery OTP
13. ⏳ Responsive polishing

## Running the Application

### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

### Backend Only
```bash
npm run backend
```

### Frontend Only
```bash
npm run frontend
```

## Important Notes

- **No TypeScript** - Pure JavaScript/JSX
- **ES Modules Only** - No CommonJS
- **Security First** - Passwords hashed, JWT protected, no sensitive data in frontend
- **Backend Authority** - All business logic (prices, delivery charges, OTP) verified on backend
- **Clean Code** - Meaningful names, minimal abstraction, production-ready
- **Responsive Design** - Mobile-first approach

## Contributing

This project is for learning MERN stack and building production-grade features step by step.

## License

MIT
