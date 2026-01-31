import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { salesOrderSchema } from '../validations/salesOrder.validation.js';
import {
  getSalesOrders,
  getSalesOrder,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder
} from '../controllers/salesOrder.controller.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getSalesOrders)
  .post(validate(salesOrderSchema), createSalesOrder);

router.route('/:id')
  .get(getSalesOrder)
  .put(validate(salesOrderSchema), updateSalesOrder)
  .delete(deleteSalesOrder);

export default router;
