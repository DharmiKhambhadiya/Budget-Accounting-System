import CustomerInvoice from '../models/CustomerInvoice.model.js';
import SalesOrder from '../models/SalesOrder.model.js';
import autoAssignAnalyticalAccount from '../utils/autoAssignAnalyticalAccount.js';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import { successResponse, errorResponse } from '../middleware/response.middleware.js';
import { verifyContact, verifyAnalyticalAccount, verifyProduct, verifySalesOrder } from '../utils/verifyReferences.js';

export const getCustomerInvoices = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.customerId) filter.customerId = req.query.customerId;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.salesOrderId) filter.salesOrderId = req.query.salesOrderId;
  if (req.query.analyticalAccountId) filter.analyticalAccountId = req.query.analyticalAccountId;
  
  const invoices = await CustomerInvoice.find(filter)
    .populate('customerId', 'name contactType')
    .populate('salesOrderId', 'orderNumber orderDate')
    .populate('analyticalAccountId', 'name')
    .populate('items.productId', 'name unit')
    .populate('createdBy', 'name email')
    .sort({ invoiceDate: -1 });
  
  return successResponse(res, 200, 'Customer invoices retrieved successfully', { count: invoices.length, invoices });
});

export const getCustomerInvoice = asyncHandler(async (req, res) => {
  const invoice = await CustomerInvoice.findById(req.params.id)
    .populate('customerId', 'name contactType addressLine1 addressLine2')
    .populate('salesOrderId', 'orderNumber orderDate items')
    .populate('analyticalAccountId', 'name')
    .populate('items.productId', 'name unit category')
    .populate('createdBy', 'name email');
  if (!invoice) return errorResponse(res, 404, 'Customer invoice not found');
  return successResponse(res, 200, 'Customer invoice retrieved successfully', invoice);
});

export const createCustomerInvoice = asyncHandler(async (req, res) => {
  const customerCheck = await verifyContact(req.body.customerId, 'customer');
  if (!customerCheck.valid) return errorResponse(res, 400, customerCheck.message);
  
  if (req.body.salesOrderId) {
    const soCheck = await verifySalesOrder(req.body.salesOrderId);
    if (!soCheck.valid) return errorResponse(res, 400, soCheck.message);
  }
  
  if (req.body.analyticalAccountId) {
    const accountCheck = await verifyAnalyticalAccount(req.body.analyticalAccountId);
    if (!accountCheck.valid) return errorResponse(res, 400, accountCheck.message);
  }
  
  if (req.body.items && req.body.items.length > 0) {
    for (const item of req.body.items) {
      if (item.productId) {
        const productCheck = await verifyProduct(item.productId);
        if (!productCheck.valid) return errorResponse(res, 400, productCheck.message);
      }
    }
  }
  
  req.body.createdBy = req.user._id;
  
  if (req.body.salesOrderId) {
    const salesOrder = await SalesOrder.findById(req.body.salesOrderId);
    if (salesOrder) {
      if (!req.body.items) req.body.items = salesOrder.items;
      if (!req.body.customerId) req.body.customerId = salesOrder.customerId;
      salesOrder.status = 'invoiced';
      await salesOrder.save();
    }
  }
  
  if (!req.body.analyticalAccountId) {
    const autoAccountId = await autoAssignAnalyticalAccount({
      customerId: req.body.customerId,
      items: req.body.items,
      totalAmount: req.body.totalAmount
    });
    if (autoAccountId) req.body.analyticalAccountId = autoAccountId;
  }
  
  const invoice = await CustomerInvoice.create(req.body);
  return successResponse(res, 201, 'Customer invoice created successfully', invoice);
});

export const updateCustomerInvoice = asyncHandler(async (req, res) => {
  const invoice = await CustomerInvoice.findById(req.params.id);
  if (!invoice) return errorResponse(res, 404, 'Customer invoice not found');
  
  if (req.body.customerId) {
    const customerCheck = await verifyContact(req.body.customerId, 'customer');
    if (!customerCheck.valid) return errorResponse(res, 400, customerCheck.message);
  }
  
  if (req.body.salesOrderId) {
    const soCheck = await verifySalesOrder(req.body.salesOrderId);
    if (!soCheck.valid) return errorResponse(res, 400, soCheck.message);
  }
  
  if (req.body.analyticalAccountId) {
    const accountCheck = await verifyAnalyticalAccount(req.body.analyticalAccountId);
    if (!accountCheck.valid) return errorResponse(res, 400, accountCheck.message);
  }
  
  if (req.body.items && req.body.items.length > 0) {
    for (const item of req.body.items) {
      if (item.productId) {
        const productCheck = await verifyProduct(item.productId);
        if (!productCheck.valid) return errorResponse(res, 400, productCheck.message);
      }
    }
  }
  
  if (!req.body.analyticalAccountId && invoice.status === 'draft') {
    const autoAccountId = await autoAssignAnalyticalAccount({
      customerId: req.body.customerId || invoice.customerId,
      items: req.body.items || invoice.items,
      totalAmount: req.body.totalAmount || invoice.totalAmount
    });
    if (autoAccountId) req.body.analyticalAccountId = autoAccountId;
  }
  
  const updatedInvoice = await CustomerInvoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  return successResponse(res, 200, 'Customer invoice updated successfully', updatedInvoice);
});

export const deleteCustomerInvoice = asyncHandler(async (req, res) => {
  const invoice = await CustomerInvoice.findById(req.params.id);
  if (!invoice) return errorResponse(res, 404, 'Customer invoice not found');
  if (invoice.status !== 'draft') return errorResponse(res, 400, 'Only draft invoices can be deleted');
  await invoice.deleteOne();
  return successResponse(res, 200, 'Customer invoice deleted successfully');
});
