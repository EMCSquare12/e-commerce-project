import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Relation to User model
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Validates that only admins can create products
    },
    name: {
      type: String,
      required: true,
    },
    image: [{
      type: String,
      required: true,
    }],
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'In Stock'
    },
    sku: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema], // Array of reviews
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  if (this.countInStock === 0) {
    this.status = "Out of Stock"
  }
  else if (this.countInStock > 0 && this.countInStock <= 10) {
    this.status = "Low Stock"
  }
  else {
    this.status = "In Stock"
  }
  next()
})

const Product = mongoose.model('Product', productSchema);

export default Product;