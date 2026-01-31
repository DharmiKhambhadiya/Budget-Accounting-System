import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  getAdminDashboard,
  getUserDashboard
} from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/admin', protect, authorize('admin'), getAdminDashboard);
router.get('/user', protect, getUserDashboard);

export default router;
