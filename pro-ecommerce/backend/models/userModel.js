import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    phoneNumber: {
        type: Number, // Note: String is often better for phones (e.g., "+639...")
        required: true,
        unique: true
    },
    totalSpent: {
        type: Number,
        required: true,
        default: 0
    },
    // --- Updated Field ---
    totalOrder: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Links to your Product model
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        purchasedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // ---------------------
    status: {
        type: String,
        required: true,
        default: 'active', // Added default to prevent creation errors
        enum: ['active', 'inactive', 'suspended'] // Optional: Good practice
    }
}, {
    timestamps: true,
});

// Method to check password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving (during registration)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;