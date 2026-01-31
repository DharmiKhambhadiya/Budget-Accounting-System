import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import config from '../config/config.js';
import { errorResponse } from './response.middleware.js';

/**
 * Protect routes - verify JWT token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 401, 'Not authorized to access this route');
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return errorResponse(res, 401, 'User not found');
      }

      if (!req.user.isActive) {
        return errorResponse(res, 401, 'User account is inactive');
      }

      next();
    } catch (err) {
      return errorResponse(res, 401, 'Invalid or expired token');
    }
  } catch (error) {
    return errorResponse(res, 500, 'Server error in authentication');
  }
};

/**
 * Grant access to specific roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res, 
        403, 
        `User role '${req.user.role}' is not authorized to access this route`
      );
    }
    next();
  };
};
