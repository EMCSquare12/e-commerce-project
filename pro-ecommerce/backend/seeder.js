import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        // 1. Clear all existing data
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // 2. Insert Users
        const createdUsers = await User.insertMany(users);

        // 3. Get the Admin User ID (First user in our users.js list)
        const adminUser = createdUsers[0]._id;

        // 4. Add the Admin User ID to every product
        // (Because our Product model requires a 'user' field)
        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });

        // 5. Insert Products
        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

// Check command line argument to see if we are importing or destroying
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}