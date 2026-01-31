import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { purchaseOrderSchema } from '../validations/purchaseOrder.validation.js';
import {
  getPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder
} from '../controllers/purchaseOrder.controller.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getPurchaseOrders)
  .post(validate(purchaseOrderSchema), createPurchaseOrder);

router.route('/:id')
  .get(getPurchaseOrder)
  .put(validate(purchaseOrderSchema), updatePurchaseOrder)
  .delete(deletePurchaseOrder);

export default router;
