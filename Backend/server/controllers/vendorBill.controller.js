import VendorBill from '../models/VendorBill.model.js';
import autoAssignAnalyticalAccount from '../utils/autoAssignAnalyticalAccount.js';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import { successResponse, errorResponse } from '../middleware/response.middleware.js';
import { verifyContact, verifyAnalyticalAccount, verifyProduct, verifyPurchaseOrder } from '../utils/verifyReferences.js';

export const getVendorBills = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.vendorId) filter.vendorId = req.query.vendorId;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.analyticalAccountId) filter.analyticalAccountId = req.query.analyticalAccountId;
  
  const bills = await VendorBill.find(filter)
    .populate('vendorId', 'name contactType')
    .populate('analyticalAccountId', 'name')
    .populate('items.productId', 'name unit')
    .populate('createdBy', 'name email')
    .sort({ billDate: -1 });
  
  return successResponse(res, 200, 'Vendor bills retrieved successfully', { count: bills.length, bills });
});

export const getVendorBill = asyncHandler(async (req, res) => {
  const bill = await VendorBill.findById(req.params.id)
    .populate('vendorId', 'name contactType addressLine1 addressLine2')
    .populate('analyticalAccountId', 'name')
    .populate('items.productId', 'name unit category')
    .populate('createdBy', 'name email');
  if (!bill) return errorResponse(res, 404, 'Vendor bill not found');
  return successResponse(res, 200, 'Vendor bill retrieved successfully', bill);
});

export const createVendorBill = asyncHandler(async (req, res) => {
  const vendorCheck = await verifyContact(req.body.vendorId, 'vendor');
  if (!vendorCheck.valid) return errorResponse(res, 400, vendorCheck.message);
  
  if (req.body.purchaseOrderId) {
    const poCheck = await verifyPurchaseOrder(req.body.purchaseOrderId);
    if (!poCheck.valid) return errorResponse(res, 400, poCheck.message);
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
  
  if (!req.body.analyticalAccountId) {
    const autoAccountId = await autoAssignAnalyticalAccount({
      vendorId: req.body.vendorId,
      items: req.body.items,
      totalAmount: req.body.totalAmount
    });
    if (autoAccountId) req.body.analyticalAccountId = autoAccountId;
  }
  
  const bill = await VendorBill.create(req.body);
  return successResponse(res, 201, 'Vendor bill created successfully', bill);
});

export const updateVendorBill = asyncHandler(async (req, res) => {
  const bill = await VendorBill.findById(req.params.id);
  if (!bill) return errorResponse(res, 404, 'Vendor bill not found');
  
  if (req.body.vendorId) {
    const vendorCheck = await verifyContact(req.body.vendorId, 'vendor');
    if (!vendorCheck.valid) return errorResponse(res, 400, vendorCheck.message);
  }
  
  if (req.body.purchaseOrderId) {
    const poCheck = await verifyPurchaseOrder(req.body.purchaseOrderId);
    if (!poCheck.valid) return errorResponse(res, 400, poCheck.message);
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
  
  if (!req.body.analyticalAccountId && bill.status === 'draft') {
    const autoAccountId = await autoAssignAnalyticalAccount({
      vendorId: req.body.vendorId || bill.vendorId,
      items: req.body.items || bill.items,
      totalAmount: req.body.totalAmount || bill.totalAmount
    });
    if (autoAccountId) req.body.analyticalAccountId = autoAccountId;
  }
  
  const updatedBill = await VendorBill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  return successResponse(res, 200, 'Vendor bill updated successfully', updatedBill);
});

export const deleteVendorBill = asyncHandler(async (req, res) => {
  const bill = await VendorBill.findById(req.params.id);
  if (!bill) return errorResponse(res, 404, 'Vendor bill not found');
  if (bill.status !== 'draft') return errorResponse(res, 400, 'Only draft bills can be deleted');
  await bill.deleteOne();
  return successResponse(res, 200, 'Vendor bill deleted successfully');
});
