import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { productSchema } from '../validations/product.validation.js';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getProducts)
  .post(validate(productSchema), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(validate(productSchema), updateProduct)
  .delete(deleteProduct);

export default router;
