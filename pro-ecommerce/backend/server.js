import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js'

connectDB();

const app = express();

// Body parser middleware (to read JSON data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware (to read the JWT)
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Mount the routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});