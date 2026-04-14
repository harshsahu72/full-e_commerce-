# 🛍️ AION — Full-Stack E-Commerce (SAHU Store)

A premium, full-stack eCommerce application built with **Node.js**, **Express**, **MongoDB**, and a **Vanilla JS** frontend. Features a complete shopping experience with user authentication, product browsing, cart management, and order tracking — all wrapped in a sleek boutique aesthetic.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with hashed passwords via `bcryptjs`
- 🛒 **Shopping Cart** — Add, update, and remove items dynamically
- 📦 **Order Management** — Place orders and view order history
- 🗂️ **Product Catalog** — Browse products with search and filtering
- 👤 **User Profiles** — Manage account info and addresses
- 🌱 **Database Seeder** — Pre-populate the DB with sample products
- 🖼️ **Image Uploads** — Product images via `multer`
- 🌐 **RESTful API** — Clean and organized backend routes

---

## 🗂️ Project Structure

```
full e_commerce/
├── backend/
│   ├── controllers/       # Route handler logic
│   ├── middleware/        # Auth middleware (JWT verify)
│   ├── models/            # Mongoose models (User, Product, Order)
│   ├── routes/            # Express route definitions
│   ├── server.js          # App entry point
│   ├── seeder.js          # DB seed data
│   └── runSeed.js         # Run the seeder
├── frontend/
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript modules (auth, api, cart, etc.)
│   └── index.html         # Single-page frontend
├── .env                   # Environment variables (not committed)
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/full-ecommerce.git
cd full-ecommerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopify_ecommerce
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### 4. Seed the database (optional)

```bash
npm run seed
```

### 5. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The backend will run at **http://localhost:5000**

Open `frontend/index.html` in your browser to use the app.

---

## 🔌 API Endpoints

| Method | Endpoint                  | Description              | Auth Required |
|--------|---------------------------|--------------------------|:-------------:|
| POST   | `/api/auth/register`      | Register a new user      | ❌            |
| POST   | `/api/auth/login`         | Login & receive JWT      | ❌            |
| GET    | `/api/products`           | Get all products         | ❌            |
| GET    | `/api/products/:id`       | Get single product       | ❌            |
| POST   | `/api/products`           | Create product (admin)   | ✅            |
| GET    | `/api/orders`             | Get user's orders        | ✅            |
| POST   | `/api/orders`             | Place a new order        | ✅            |
| GET    | `/api/users/profile`      | Get user profile         | ✅            |
| PUT    | `/api/users/profile`      | Update user profile      | ✅            |

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB, Mongoose                   |
| Auth      | JWT, bcryptjs                       |
| Frontend  | HTML5, CSS3, Vanilla JavaScript     |
| Dev Tools | Nodemon, dotenv                     |
| Uploads   | Multer                              |

---

## 📄 License

This project is licensed under the **ISC License**.

---

> Built with ❤️ by **SAHU Store / AION**
>
> ## 👨‍💻 Author

**Harsh Kumar**
 | Student
