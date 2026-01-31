import express from 'express';
import {
  login,
  adminRegister,
  adminLogin,
  getMe,
  adminCreateUser
} from '../controllers/auth.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  loginSchema,
  adminRegisterSchema,
  adminLoginSchema,
  adminCreateUserSchema
} from '../validations/auth.validation.js';

const router = express.Router();

// Public routes
router.post('/login', validate(loginSchema), login);
router.post('/admin/register', validate(adminRegisterSchema), adminRegister);
router.post('/admin/login', validate(adminLoginSchema), adminLogin);

// Protected routes
router.get('/me', protect, getMe);

// Admin routes
router.post(
  '/admin/create-user',
  protect,
  authorize('admin'),
  validate(adminCreateUserSchema),
  adminCreateUser
);

export default router;
