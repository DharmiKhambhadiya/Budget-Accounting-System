import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { customerInvoiceSchema } from '../validations/customerInvoice.validation.js';
import {
  getCustomerInvoices,
  getCustomerInvoice,
  createCustomerInvoice,
  updateCustomerInvoice,
  deleteCustomerInvoice
} from '../controllers/customerInvoice.controller.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getCustomerInvoices)
  .post(validate(customerInvoiceSchema), createCustomerInvoice);

router.route('/:id')
  .get(getCustomerInvoice)
  .put(validate(customerInvoiceSchema), updateCustomerInvoice)
  .delete(deleteCustomerInvoice);

export default router;
