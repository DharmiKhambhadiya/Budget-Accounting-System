import Joi from 'joi';

const itemSchema = Joi.object({
  productId: Joi.string().optional(),
  description: Joi.string().trim().optional(),
  quantity: Joi.number().min(0).required(),
  unitPrice: Joi.number().min(0).required(),
  taxRate: Joi.number().min(0).default(0),
  amount: Joi.number().min(0).required()
});

export const salesOrderSchema = Joi.object({
  orderNumber: Joi.string().trim().optional(),
  referenceNumber: Joi.string().trim().optional(),
  customerId: Joi.string().required(),
  orderDate: Joi.date().required(),
  deliveryDate: Joi.date().optional(),
  items: Joi.array().items(itemSchema).min(1).required(),
  analyticalAccountId: Joi.string().optional(),
  status: Joi.string().valid('draft', 'confirmed', 'invoiced', 'delivered', 'cancelled').default('draft'),
  notes: Joi.string().trim().optional()
});
