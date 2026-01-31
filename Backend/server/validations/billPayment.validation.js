import Joi from 'joi';

export const billPaymentSchema = Joi.object({
  paymentNumber: Joi.string().trim().optional(),
  vendorBillId: Joi.string().required(),
  vendorId: Joi.string().required(),
  paymentDate: Joi.date().required(),
  paymentMethod: Joi.string().valid('cash', 'cheque', 'bank_transfer', 'online', 'other').required(),
  amount: Joi.number().min(0).required(),
  referenceNumber: Joi.string().trim().optional(),
  notes: Joi.string().trim().optional(),
  analyticalAccountId: Joi.string().optional(),
  status: Joi.string().valid('pending', 'completed', 'cancelled').default('pending')
});
