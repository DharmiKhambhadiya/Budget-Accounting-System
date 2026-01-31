import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().optional(),
  category: Joi.string().trim().optional(),
  unit: Joi.string().trim().required(),
  salesPrice: Joi.number().min(0).default(0),
  purchasePrice: Joi.number().min(0).default(0),
  stockQuantity: Joi.number().min(0).default(0)
});
