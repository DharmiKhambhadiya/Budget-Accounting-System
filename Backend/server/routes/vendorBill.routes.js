import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { vendorBillSchema } from '../validations/vendorBill.validation.js';
import {
  getVendorBills,
  getVendorBill,
  createVendorBill,
  updateVendorBill,
  deleteVendorBill
} from '../controllers/vendorBill.controller.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getVendorBills)
  .post(validate(vendorBillSchema), createVendorBill);

router.route('/:id')
  .get(getVendorBill)
  .put(validate(vendorBillSchema), updateVendorBill)
  .delete(deleteVendorBill);

export default router;
