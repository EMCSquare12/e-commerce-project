    import express from 'express';
    import dotenv from 'dotenv';
    import cookieParser from 'cookie-parser';
    import cors from 'cors';
    import path from 'path';
    import { Server } from 'socket.io';
    dotenv.config({ path: path.resolve('..', '.env') });
    import connectDB from './config/db.js';
    import { notFound, errorHandler } from './middleware/errorMiddleware.js';

    import productRoutes from './routes/productRoutes.js';
    import userRoutes from './routes/userRoutes.js';
    import orderRoutes from './routes/orderRoutes.js';
    import paymentRoutes from './routes/paymentRoutes.js';
    import adminRoutes from './routes/adminRoutes.js';
    import imageRoutes from './routes/imageRoutes.js';
    import notificationsRoutes from './routes/notificationsRoutes.js';

    connectDB();

    const app = express();
    const PORT = process.env.PORT || 5000;

    const httpServer = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    const io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:3000",
                "http://localhost:3001",
                "https://pro-shop-ecommerce.netlify.app",
                "https://pro-shop-ecommerce-admin.netlify.app"
            ],
            credentials: true
        }
    });

    app.use((req, res, next) => {
        req.io = io;
        next();
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(cors());

    app.use('/api/products', productRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/payments', paymentRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/upload', imageRoutes);
    app.use('/api/notifications', notificationsRoutes);

    app.use(notFound);
    app.use(errorHandler);