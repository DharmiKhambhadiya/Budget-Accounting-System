import express from 'express';
import {
  getProfile,
  updateProfile,
  updatePassword,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  updateProfileSchema,
  updatePasswordSchema
} from '../validations/user.validation.js';

const router = express.Router();

// Profile routes (accessible to authenticated users)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.put('/profile/password', protect, validate(updatePasswordSchema), updatePassword);

// Admin routes (require admin role)
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;
