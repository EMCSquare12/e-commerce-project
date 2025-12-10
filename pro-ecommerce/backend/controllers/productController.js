import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products?keyword=abc&category=Electronics,Cameras&pageNumber=1 
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
      name: {
        $regex: req.query.keyword,
        $options: 'i',
      },
    }
    : {};

  // Handle Category Filter (Support Multiple)
  let category = {};
  if (req.query.category) {
    const categories = req.query.category.split(',');
    category = { category: { $in: categories } };
  }

  // Handle Brand Filter (Support Multiple)
  let brand = {}
  if (req.query.brand) {
    const brands = req.query.brand.split(',');
    brand = { brand: { $in: brands } };
  }
  const filter = { ...keyword, ...category, ...brand };

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

  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get all categories with counts
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    {
      $group: {
        _id: '$category',      // Group by the 'category' field
        count: { $sum: 1 },    // Count how many items match
      },
    },
    {
      $sort: { _id: 1 },       // Optional: Sort alphabetically A-Z
    },
  ]);

  // The result will look like:
  // [ { _id: "Electronics", count: 12 }, { _id: "Audio", count: 5 } ]

  res.json(categories);
});

const getBrands = asyncHandler(async (req, res) => {
  const brands = (await Product.distinct("brand")).sort();
  res.json(brands);
});

export { getProducts, getProductById, deleteProduct, getCategories, getBrands };