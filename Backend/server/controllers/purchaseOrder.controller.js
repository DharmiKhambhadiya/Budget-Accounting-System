import PurchaseOrder from '../models/PurchaseOrder.model.js';
import autoAssignAnalyticalAccount from '../utils/autoAssignAnalyticalAccount.js';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import { successResponse, errorResponse } from '../middleware/response.middleware.js';
import { verifyContact, verifyAnalyticalAccount, verifyProduct } from '../utils/verifyReferences.js';

export const getPurchaseOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.vendorId) filter.vendorId = req.query.vendorId;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.analyticalAccountId) filter.analyticalAccountId = req.query.analyticalAccountId;
  
  const orders = await PurchaseOrder.find(filter)
    .populate('vendorId', 'name contactType')
    .populate('analyticalAccountId', 'name')
    .populate('items.productId', 'name unit')
    .populate('createdBy', 'name email')
    .sort({ orderDate: -1 });
  
  return successResponse(res, 200, 'Purchase orders retrieved successfully', { count: orders.length, orders });
});

export const getPurchaseOrder = asyncHandler(async (req, res) => {
  const order = await PurchaseOrder.findById(req.params.id)
    .populate('vendorId', 'name contactType addressLine1 addressLine2')
    .populate('analyticalAccountId', 'name')
    .populate('items.productId', 'name unit category')
    .populate('createdBy', 'name email');
  if (!order) return errorResponse(res, 404, 'Purchase order not found');
  return successResponse(res, 200, 'Purchase order retrieved successfully', order);
});

export const createPurchaseOrder = asyncHandler(async (req, res) => {
  const vendorCheck = await verifyContact(req.body.vendorId, 'vendor');
  if (!vendorCheck.valid) return errorResponse(res, 400, vendorCheck.message);
  
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
      vendorId: req.body.vendorId,
      items: req.body.items,
      totalAmount: req.body.totalAmount
    });
    if (autoAccountId) req.body.analyticalAccountId = autoAccountId;
  }
  
  const order = await PurchaseOrder.create(req.body);
  return successResponse(res, 201, 'Purchase order created successfully', order);
});

export const updatePurchaseOrder = asyncHandler(async (req, res) => {
  const order = await PurchaseOrder.findById(req.params.id);
  if (!order) return errorResponse(res, 404, 'Purchase order not found');
  
  if (req.body.vendorId) {
    const vendorCheck = await verifyContact(req.body.vendorId, 'vendor');
    if (!vendorCheck.valid) return errorResponse(res, 400, vendorCheck.message);
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
      vendorId: req.body.vendorId || order.vendorId,
      items: req.body.items || order.items,
      totalAmount: req.body.totalAmount || order.totalAmount
    });
    if (autoAccountId) req.body.analyticalAccountId = autoAccountId;
  }
  
  const updatedOrder = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  return successResponse(res, 200, 'Purchase order updated successfully', updatedOrder);
});

export const deletePurchaseOrder = asyncHandler(async (req, res) => {
  const order = await PurchaseOrder.findById(req.params.id);
  if (!order) return errorResponse(res, 404, 'Purchase order not found');
  if (order.status !== 'draft') return errorResponse(res, 400, 'Only draft orders can be deleted');
  await order.deleteOne();
  return successResponse(res, 200, 'Purchase order deleted successfully');
});
