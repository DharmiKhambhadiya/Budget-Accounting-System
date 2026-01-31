import Joi from 'joi';

export const autoAnalyticalModelSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  ruleType: Joi.string().valid('vendor_based', 'product_based', 'amount_based', 'custom').required(),
  conditions: Joi.object({
    vendorId: Joi.string().optional(),
    productId: Joi.string().optional(),
    minAmount: Joi.number().min(0).optional(),
    maxAmount: Joi.number().min(0).optional(),
    keywords: Joi.array().items(Joi.string().trim()).optional()
  }).optional(),
  analyticalAccountId: Joi.string().required(),
  priority: Joi.number().min(0).default(0)
});
