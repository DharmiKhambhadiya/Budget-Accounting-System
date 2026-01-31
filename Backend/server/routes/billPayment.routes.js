import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { billPaymentSchema } from '../validations/billPayment.validation.js';
import {
  getBillPayments,
  getBillPayment,
  createBillPayment,
  updateBillPayment,
  deleteBillPayment
} from '../controllers/billPayment.controller.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getBillPayments)
  .post(validate(billPaymentSchema), createBillPayment);

router.route('/:id')
  .get(getBillPayment)
  .put(validate(billPaymentSchema), updateBillPayment)
  .delete(deleteBillPayment);

export default router;
