import InvoicePayment from '../models/InvoicePayment.model.js';
import CustomerInvoice from '../models/CustomerInvoice.model.js';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import { successResponse, errorResponse } from '../middleware/response.middleware.js';
import { verifyCustomerInvoice, verifyContact, verifyAnalyticalAccount } from '../utils/verifyReferences.js';

export const getInvoicePayments = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.customerInvoiceId) filter.customerInvoiceId = req.query.customerInvoiceId;
  if (req.query.customerId) filter.customerId = req.query.customerId;
  if (req.query.status) filter.status = req.query.status;
  
  const payments = await InvoicePayment.find(filter)
    .populate('customerInvoiceId', 'invoiceNumber totalAmount status')
    .populate('customerId', 'name contactType')
    .populate('analyticalAccountId', 'name')
    .populate('createdBy', 'name email')
    .sort({ paymentDate: -1 });
  
  return successResponse(res, 200, 'Invoice payments retrieved successfully', { count: payments.length, payments });
});

export const getInvoicePayment = asyncHandler(async (req, res) => {
  const payment = await InvoicePayment.findById(req.params.id)
    .populate('customerInvoiceId', 'invoiceNumber totalAmount status items')
    .populate('customerId', 'name contactType')
    .populate('analyticalAccountId', 'name')
    .populate('createdBy', 'name email');
  if (!payment) return errorResponse(res, 404, 'Invoice payment not found');
  return successResponse(res, 200, 'Invoice payment retrieved successfully', payment);
});

export const createInvoicePayment = asyncHandler(async (req, res) => {
  const invoiceCheck = await verifyCustomerInvoice(req.body.customerInvoiceId);
  if (!invoiceCheck.valid) return errorResponse(res, 400, invoiceCheck.message);
  
  const customerCheck = await verifyContact(req.body.customerId, 'customer');
  if (!customerCheck.valid) return errorResponse(res, 400, customerCheck.message);
  
  if (req.body.analyticalAccountId) {
    const accountCheck = await verifyAnalyticalAccount(req.body.analyticalAccountId);
    if (!accountCheck.valid) return errorResponse(res, 400, accountCheck.message);
  }
  
  req.body.createdBy = req.user._id;
  
  const invoice = await CustomerInvoice.findById(req.body.customerInvoiceId);
  if (!invoice) return errorResponse(res, 404, 'Customer invoice not found');
  
  const payment = await InvoicePayment.create(req.body);
  
  if (payment.status === 'completed') {
    const payments = await InvoicePayment.find({ customerInvoiceId: invoice._id, status: 'completed' });
    invoice.paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    await invoice.save();
  }
  
  return successResponse(res, 201, 'Invoice payment created successfully', payment);
});

export const updateInvoicePayment = asyncHandler(async (req, res) => {
  if (req.body.customerInvoiceId) {
    const invoiceCheck = await verifyCustomerInvoice(req.body.customerInvoiceId);
    if (!invoiceCheck.valid) return errorResponse(res, 400, invoiceCheck.message);
  }
  
  if (req.body.customerId) {
    const customerCheck = await verifyContact(req.body.customerId, 'customer');
    if (!customerCheck.valid) return errorResponse(res, 400, customerCheck.message);
  }
  
  if (req.body.analyticalAccountId) {
    const accountCheck = await verifyAnalyticalAccount(req.body.analyticalAccountId);
    if (!accountCheck.valid) return errorResponse(res, 400, accountCheck.message);
  }
  
  const payment = await InvoicePayment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!payment) return errorResponse(res, 404, 'Invoice payment not found');
  
  if (payment.status === 'completed') {
    const invoice = await CustomerInvoice.findById(payment.customerInvoiceId);
    if (invoice) {
      const payments = await InvoicePayment.find({ customerInvoiceId: invoice._id, status: 'completed' });
      invoice.paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
      await invoice.save();
    }
  }
  
  return successResponse(res, 200, 'Invoice payment updated successfully', payment);
});

export const deleteInvoicePayment = asyncHandler(async (req, res) => {
  const payment = await InvoicePayment.findByIdAndDelete(req.params.id);
  if (!payment) return errorResponse(res, 404, 'Invoice payment not found');
  
  const invoice = await CustomerInvoice.findById(payment.customerInvoiceId);
  if (invoice) {
    const payments = await InvoicePayment.find({ customerInvoiceId: invoice._id, status: 'completed' });
    invoice.paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    await invoice.save();
  }
  
  return successResponse(res, 200, 'Invoice payment deleted successfully');
});
