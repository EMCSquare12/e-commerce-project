import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';

// --- Helper Functions ---
const buildFilter = (query) => {
  const { keyword, category, brand, status } = query;
  const filter = {};

  // 1. Keyword Search (Name)
  if (keyword) {
    filter.name = { $regex: keyword, $options: 'i' };
  }

  // 2. Array-based Filters (Support comma-separated values)
  if (category) filter.category = { $in: category.split(',') };
  if (brand) filter.brand = { $in: brand.split(',') };
  if (status) filter.status = { $in: status.split(',') };

  return filter;
};

/**
 * Generic aggregation to count items grouped by a specific field.
 */
const getGroupedCounts = async (field) => {
  return await Product.aggregate([
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
};

// --- Controllers ---

// @desc    Fetch all products (Public view)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const filter = buildFilter(req.query);

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch products for Admin (custom page size & filters)
// @route   GET /api/products/admin
// @access  Private/Admin
const getProductsAdmin = asyncHandler(async (req, res) => {
  const pageSize = 10; // Admin might want to see more rows
  const page = Number(req.query.pageNumber) || 1;

  const filter = buildFilter(req.query);

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    images,
    brand,
    category,
    countInStock,
    description,
    sku
  } = req.body;

  let imageArray;
  if (images) {
    imageArray = Array.isArray(images) ? images : [images];
  } else {
    imageArray = ['/images/sample.jpg'];
  }

  const product = new Product({
    user: req.user._id,
    name,
    price,
    image: imageArray,
    brand,
    category,
    countInStock,
    description,
    sku
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product (Name, Price, Stock only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, countInStock, image, imageToDelete } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.name = name || product.name;
  product.price = price !== undefined ? price : product.price;
  product.countInStock =
    countInStock !== undefined ? countInStock : product.countInStock;

  if (Array.isArray(imageToDelete) && imageToDelete.length > 0) {
    const deleteUrls = imageToDelete.map((img) => img.url);

    product.image = product.image.filter(
      (img) => !deleteUrls.includes(img)
    );
  }

  if (Array.isArray(image)) {
    product.image = image;
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ message: 'Product removed' });
});

// @desc    Get all categories with counts
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await getGroupedCounts('category');
  res.json(categories);
});

// @desc    Get all brands with counts
// @route   GET /api/products/brands
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
  const brands = await getGroupedCounts('brand');
  res.json(brands);
});

// @desc    Get distinct stock statuses
// @route   GET /api/products/status
// @access  Public
const getStockStatus = asyncHandler(async (req, res) => {
  const stockStatus = await Product.distinct("status");
  res.json(stockStatus);
});

const getProductNavigation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error('Invalid Product ID');
  }

  const objectId = new mongoose.Types.ObjectId(id);

  const [prev, next] = await Promise.all([
    Product.findOne({ _id: { $lt: objectId } })
      .sort({ _id: -1 }),

    Product.findOne({ _id: { $gt: objectId } })
      .sort({ _id: 1 })
  ]);

  res.json({ prev, next });
});

const submitReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

export {
  getProducts,
  getProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  getStockStatus,
  getProductNavigation,
  submitReview
};