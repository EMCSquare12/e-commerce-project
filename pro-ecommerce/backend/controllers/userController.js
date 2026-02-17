import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import generateToken from '../utils/generateToken.js';
import { escapeRegExp } from '../utils/escapeRegExp.js';
import { OAuth2Client } from 'google-auth-library';
import mongoose from 'mongoose';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Auth user & get token via Google
// @route   POST /api/users/google
// @access  Public
const authGoogleUser = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(400);
    throw new Error('Google token is missing');
  }

  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    res.status(400);
    throw new Error('Invalid Google Token');
  }

  const googleUser = await response.json();
  const { email, name } = googleUser;

  let user = await User.findOne({ email });

  if (user) {
    const jwtToken = generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phoneNumber: user.phoneNumber,
      totalSpent: user.totalSpent,
      token: jwtToken,
    });
  } else {
    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

    user = await User.create({
      name,
      email,
      password: randomPassword
    });

    if (user) {
      const jwtToken = generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phoneNumber: user.phoneNumber,
        token: jwtToken,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  }
});


// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;


  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error('Password must be at least 8 characters long and contain both uppercase and lowercase letters');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phoneNumber
  });

  if (user) {
    const token = generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phoneNumber: user.phoneNumber,
      totalSpent: user.totalSpent,
      token: token
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});



const getUserDetails = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const filter = {};

  const { keyword, status } = req.query;

  if (keyword) {
    const searchRegex = { $regex: keyword, $options: 'i' };

    filter.$or = [
      { name: searchRegex },
      { email: searchRegex }
    ];

    if (!isNaN(keyword) && keyword.trim() !== '') {
      filter.$or.push({ phoneNumber: Number(keyword) });
    }
  }

  if (status) {
    if (status === "active") {
      filter.status = "active";
    } else if (status === "inactive") {
      filter.status = "inactive";
    }
  }

  const count = await User.countDocuments(filter);
  const users = await User.find(filter)
    .populate('orders.product', 'name price image')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ users, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get user by ID with PAGINATED Orders
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword;

  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(404);
    throw new Error('Invalid User ID');
  }

  const user = await User.findById(req.params.id).select('name email phoneNumber createdAt status');

  if (user) {
    const orderFilter = { user: user._id };

    if (keyword && keyword.trim() !== '') {
      const cleanKeyword = keyword.trim();
      const safeKeyword = escapeRegExp(cleanKeyword);
      const keywordRegex = { $regex: safeKeyword, $options: 'i' };

      const orConditions = [
        { orderId: keywordRegex },
        { 'orderItems.name': keywordRegex }
      ];
      orderFilter.$or = orConditions;
    }

    const count = await Order.countDocuments(orderFilter);

    const orders = await Order.find(orderFilter)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    const allOrders = await Order.find({ user: user._id }).select('totalPrice');
    const totalSpent = allOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    const totalOrders = count;

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        number: user.phoneNumber,
        dateJoined: user.createdAt,
        status: user.status || 'active'
      },
      orders: {
        totalOrders,
        totalSpent,
        history: orders.map(order => ({
          orderId: order.orderId || order._id,
          dateOrdered: order.createdAt,
          items: order.orderItems,
          totalAmount: order.totalPrice,
          status: order.isDelivered ? 'Shipped' : 'Pending'
        })),
        page,
        pages: Math.ceil(count / pageSize)
      }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUserNavigation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error('Invalid User ID');
  }

  const objectId = new mongoose.Types.ObjectId(id);

  const [prev, next] = await Promise.all([
    User.findOne({ _id: { $lt: objectId } })
      .sort({ _id: -1 }),

    User.findOne({ _id: { $gt: objectId } })
      .sort({ _id: 1 })
  ]);

  res.json({ prev, next });
});


export {
  authUser,
  registerUser,
  logoutUser,
  getUserDetails,
  getUserById,
  authGoogleUser,
  getUserNavigation
};