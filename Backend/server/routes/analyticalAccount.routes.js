import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { analyticalAccountSchema } from '../validations/analyticalAccount.validation.js';
import {
  getAnalyticalAccounts,
  getAnalyticalAccount,
  createAnalyticalAccount,
  updateAnalyticalAccount,
  deleteAnalyticalAccount
} from '../controllers/analyticalAccount.controller.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getAnalyticalAccounts)
  .post(validate(analyticalAccountSchema), createAnalyticalAccount);

router.route('/:id')
  .get(getAnalyticalAccount)
  .put(validate(analyticalAccountSchema), updateAnalyticalAccount)
  .delete(deleteAnalyticalAccount);

export default router;
