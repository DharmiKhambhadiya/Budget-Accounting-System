import Joi from 'joi';

const itemSchema = Joi.object({
  productId: Joi.string().optional(),
  description: Joi.string().trim().optional(),
  quantity: Joi.number().min(0).required(),
  unitPrice: Joi.number().min(0).required(),
  taxRate: Joi.number().min(0).default(0),
  amount: Joi.number().min(0).required()
});

export const customerInvoiceSchema = Joi.object({
  invoiceNumber: Joi.string().trim().optional(),
  referenceNumber: Joi.string().trim().optional(),
  salesOrderId: Joi.string().optional(),
  customerId: Joi.string().required(),
  invoiceDate: Joi.date().required(),
  dueDate: Joi.date().optional(),
  items: Joi.array().items(itemSchema).min(1).required(),
  analyticalAccountId: Joi.string().optional(),
  status: Joi.string().valid('draft', 'sent', 'paid', 'partially_paid', 'overdue', 'cancelled').default('draft'),
  notes: Joi.string().trim().optional(),
  attachments: Joi.array().items(Joi.string()).optional()
});
