import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { autoAnalyticalModelSchema } from '../validations/autoAnalyticalModel.validation.js';
import {
  getAutoAnalyticalModels,
  getAutoAnalyticalModel,
  createAutoAnalyticalModel,
  updateAutoAnalyticalModel,
  deleteAutoAnalyticalModel
} from '../controllers/autoAnalyticalModel.controller.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getAutoAnalyticalModels)
  .post(validate(autoAnalyticalModelSchema), createAutoAnalyticalModel);

router.route('/:id')
  .get(getAutoAnalyticalModel)
  .put(validate(autoAnalyticalModelSchema), updateAutoAnalyticalModel)
  .delete(deleteAutoAnalyticalModel);

export default router;
