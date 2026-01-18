import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
import connectDB from './backend/config/db.js';
import { notFound, errorHandler } from './backend/middleware/errorMiddleware.js';

import productRoutes from './backend/routes/productRoutes.js';
import userRoutes from './backend/routes/userRoutes.js';
import orderRoutes from './backend/routes/orderRoutes.js';
import paymentRoutes from './backend/routes/paymentRoutes.js';
import adminRoutes from './backend/routes/adminRoutes.js';
import imageRoutes from './backend/routes/imageRoutes.js';
import notificationsRoutes from './backend/routes/notificationsRoutes.js';



connectDB();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://pro-shop-ecommerce.netlify.app",
        "https://pro-shop-ecommerce-admin.netlify.app"

    ],
    credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Mount routes...
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', imageRoutes);
app.use('/api/notifications', notificationsRoutes);

// Error Handling...
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});