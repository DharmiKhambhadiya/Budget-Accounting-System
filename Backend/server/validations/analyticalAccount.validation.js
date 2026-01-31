import Joi from 'joi';

export const analyticalAccountSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().optional(),
  accountType: Joi.string().trim().optional()
});
