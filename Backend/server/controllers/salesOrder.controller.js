import SalesOrder from '../models/SalesOrder.model.js';
import autoAssignAnalyticalAccount from '../utils/autoAssignAnalyticalAccount.js';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import { successResponse, errorResponse } from '../middleware/response.middleware.js';
import { verifyContact, verifyAnalyticalAccount, verifyProduct } from '../utils/verifyReferences.js';

export const getSalesOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.customerId) filter.customerId = req.query.customerId;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.analyticalAccountId) filter.analyticalAccountId = req.query.analyticalAccountId;
  
  const orders = await SalesOrder.find(filter)
    .populate('customerId', 'name contactType')
    .populate('analyticalAccountId', 'name')
    .populate('items.productId', 'name unit')
    .populate('createdBy', 'name email')
    .sort({ orderDate: -1 });
  
  return successResponse(res, 200, 'Sales orders retrieved successfully', { count: orders.length, orders });
});

export const getSalesOrder = asyncHandler(async (req, res) => {
  const order = await SalesOrder.findById(req.params.id)
    .populate('customerId', 'name contactType addressLine1 addressLine2')
    .populate('analyticalAccountId', 'name')
    .populate('items.productId', 'name unit category')
    .populate('createdBy', 'name email');
  if (!order) return errorResponse(res, 404, 'Sales order not found');
  return successResponse(res, 200, 'Sales order retrieved successfully', order);
});

export const createSalesOrder = asyncHandler(async (req, res) => {
  const customerCheck = await verifyContact(req.body.customerId, 'customer');
  if (!customerCheck.valid) return errorResponse(res, 400, customerCheck.message);
  
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
  
  if (!req.body.analyticalAccountId) {
    const autoAccountId = await autoAssignAnalyticalAccount({
      customerId: req.body.customerId,
      items: req.body.items,
      totalAmount: req.body.totalAmount
    });
    if (autoAccountId) req.body.analyticalAccountId = autoAccountId;
  }
  
  const order = await SalesOrder.create(req.body);
  return successResponse(res, 201, 'Sales order created successfully', order);
});

export const updateSalesOrder = asyncHandler(async (req, res) => {
  const order = await SalesOrder.findById(req.params.id);
  if (!order) return errorResponse(res, 404, 'Sales order not found');
  
  if (req.body.customerId) {
    const customerCheck = await verifyContact(req.body.customerId, 'customer');
    if (!customerCheck.valid) return errorResponse(res, 400, customerCheck.message);
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
  
  if (!req.body.analyticalAccountId && order.status === 'draft') {
    const autoAccountId = await autoAssignAnalyticalAccount({
      customerId: req.body.customerId || order.customerId,
      items: req.body.items || order.items,
      totalAmount: req.body.totalAmount || order.totalAmount
    });
    if (autoAccountId) req.body.analyticalAccountId = autoAccountId;
  }
  
  const updatedOrder = await SalesOrder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  return successResponse(res, 200, 'Sales order updated successfully', updatedOrder);
});

export const deleteSalesOrder = asyncHandler(async (req, res) => {
  const order = await SalesOrder.findById(req.params.id);
  if (!order) return errorResponse(res, 404, 'Sales order not found');
  if (order.status !== 'draft') return errorResponse(res, 400, 'Only draft orders can be deleted');
  await order.deleteOne();
  return successResponse(res, 200, 'Sales order deleted successfully');
});
