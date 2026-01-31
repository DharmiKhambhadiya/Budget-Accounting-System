import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { budgetSchema } from '../validations/budget.validation.js';
import {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget
} from '../controllers/budget.controller.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getBudgets)
  .post(validate(budgetSchema), createBudget);

router.route('/:id')
  .get(getBudget)
  .put(validate(budgetSchema), updateBudget)
  .delete(deleteBudget);

export default router;
