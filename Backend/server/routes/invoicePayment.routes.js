import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { invoicePaymentSchema } from '../validations/invoicePayment.validation.js';
import {
  getInvoicePayments,
  getInvoicePayment,
  createInvoicePayment,
  updateInvoicePayment,
  deleteInvoicePayment
} from '../controllers/invoicePayment.controller.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getInvoicePayments)
  .post(validate(invoicePaymentSchema), createInvoicePayment);

router.route('/:id')
  .get(getInvoicePayment)
  .put(validate(invoicePaymentSchema), updateInvoicePayment)
  .delete(deleteInvoicePayment);

export default router;
