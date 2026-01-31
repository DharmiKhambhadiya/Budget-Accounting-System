import Joi from 'joi';

export const budgetSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  analyticalAccountId: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  period: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    periodType: Joi.string().valid('monthly', 'quarterly', 'yearly', 'custom').required()
  }).required(),
  revisedAmount: Joi.number().min(0).optional()
});
