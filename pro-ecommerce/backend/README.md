# Backend API Documentation

The backend runs on **Port 5000** by default.

## 📌 Base URL

```
http://localhost:5000
```

---

## 🛒 Product Endpoints

### **GET /api/products**

Fetch all products.
**Access:** Public

### **GET /api/products/:id**

Fetch a single product by ID.
**Access:** Public

---

## 👤 User Endpoints

### **POST /api/users/login**

Authenticate a user and return a token.
**Access:** Public

### **POST /api/users**

Register a new user.
**Access:** Public

### **GET /api/users/profile**

Retrieve the authenticated user's profile.
**Access:** Private (Token Required)

---

## 🌱 Data Seeding

Use the following commands in the terminal to reset or seed your database:

### **Import Data**

```
npm run data:import
```

### **Destroy Data**

```
npm run data:destroy
```
