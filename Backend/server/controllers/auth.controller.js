import User from '../models/User.model.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import { successResponse, errorResponse } from '../middleware/response.middleware.js';
import { sendCredentialsEmail } from '../services/email.service.js';

/**
 * @desc    User login (regular users only)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { loginId, password } = req.body;

  // Check for user by loginId or email
  const user = await User.findOne({
    $or: [{ loginId }, { email: loginId }]
  }).select('+password');

  if (!user) {
    return errorResponse(res, 401, 'Invalid login ID or password');
  }

  // Check if user is active
  if (!user.isActive) {
    return errorResponse(res, 401, 'User account is inactive');
  }

  // Only allow regular users to login via this endpoint
  if (user.role !== 'user') {
    return errorResponse(res, 403, 'Please use admin login endpoint');
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return errorResponse(res, 401, 'Invalid login ID or password');
  }

  const userData = {
    _id: user._id,
    name: user.name,
    loginId: user.loginId,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };

  return successResponse(res, 200, 'Login successful', userData);
});

/**
 * @desc    Admin register
 * @route   POST /api/auth/admin/register
 * @access  Public
 */
export const adminRegister = asyncHandler(async (req, res) => {
  const { name, loginId, email, password, role } = req.body;

  // Verify role is admin
  if (role !== 'admin') {
    return errorResponse(res, 400, 'Role must be admin');
  }

  // Check if user exists
  const userExists = await User.findOne({ 
    $or: [{ email }, { loginId }] 
  });

  if (userExists) {
    return errorResponse(
      res, 
      400, 
      'User with this email or login ID already exists'
    );
  }

  // Create admin user
  const user = await User.create({
    name,
    loginId,
    email,
    password,
    role: 'admin'
  });

  if (user) {
    const userData = {
      _id: user._id,
      name: user.name,
      loginId: user.loginId,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    };

    return successResponse(
      res,
      201,
      'Admin registered successfully',
      userData
    );
  }

  return errorResponse(res, 400, 'Failed to create admin');
});

/**
 * @desc    Admin login
 * @route   POST /api/auth/admin/login
 * @access  Public
 */
export const adminLogin = asyncHandler(async (req, res) => {
  const { loginId, password, role } = req.body;

  // Verify role is admin
  if (role !== 'admin') {
    return errorResponse(res, 400, 'Role must be admin');
  }

  // Check for admin user by loginId or email
  const user = await User.findOne({
    $or: [{ loginId }, { email: loginId }],
    role: 'admin'
  }).select('+password');

  if (!user) {
    return errorResponse(res, 401, 'Invalid login ID or password');
  }

  // Check if user is active
  if (!user.isActive) {
    return errorResponse(res, 401, 'Admin account is inactive');
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return errorResponse(res, 401, 'Invalid login ID or password');
  }

  const userData = {
    _id: user._id,
    name: user.name,
    loginId: user.loginId,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  };

  return successResponse(res, 200, 'Admin login successful', userData);
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  return successResponse(res, 200, 'User retrieved successfully', user);
});

/**
 * @desc    Admin create user account (default role: user)
 * @route   POST /api/auth/admin/create-user
 * @access  Private/Admin
 */
export const adminCreateUser = asyncHandler(async (req, res) => {
  const { name, loginId, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ 
    $or: [{ email }, { loginId }] 
  });

  if (userExists) {
    return errorResponse(
      res, 
      400, 
      'User with this email or login ID already exists'
    );
  }

  // Create user with default role 'user' and provided password
  const user = await User.create({
    name,
    loginId,
    email,
    password,
    role: 'user' // Always set to 'user'
  });

  if (!user) {
    return errorResponse(res, 400, 'Failed to create user');
  }

  // Send email with credentials
  const emailResult = await sendCredentialsEmail(
    {
      name: user.name,
      loginId: user.loginId,
      email: user.email,
      role: user.role
    },
    password
  );

  if (!emailResult.success) {
    console.error('Failed to send email:', emailResult.error);
    // Still return success but log the email error
  }

  const userData = {
    _id: user._id,
    name: user.name,
    loginId: user.loginId,
    email: user.email,
    role: user.role,
    emailSent: emailResult.success
  };

  return successResponse(
    res,
    201,
    'User created successfully. Credentials have been sent to user\'s email.',
    userData
  );
});
