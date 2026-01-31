import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  contactType: Joi.string().valid('vendor', 'customer').required(),
  addressLine1: Joi.string().trim().optional(),
  addressLine2: Joi.string().trim().optional(),
  email: Joi.string().email().lowercase().trim().optional(),
  phone: Joi.string().trim().optional(),
  image: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional()
});
