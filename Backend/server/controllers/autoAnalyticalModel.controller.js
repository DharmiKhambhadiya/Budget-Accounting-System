import AutoAnalyticalModel from '../models/AutoAnalyticalModel.model.js';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import { successResponse, errorResponse } from '../middleware/response.middleware.js';
import { verifyAnalyticalAccount, verifyContact, verifyProduct } from '../utils/verifyReferences.js';

export const getAutoAnalyticalModels = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
  if (req.query.ruleType) filter.ruleType = req.query.ruleType;
  
  const models = await AutoAnalyticalModel.find(filter)
    .populate('analyticalAccountId', 'name')
    .populate('conditions.vendorId', 'name')
    .populate('conditions.productId', 'name')
    .populate('createdBy', 'name email')
    .sort({ priority: -1, createdAt: -1 });
  
  return successResponse(res, 200, 'Auto-analytical models retrieved successfully', { count: models.length, models });
});

export const getAutoAnalyticalModel = asyncHandler(async (req, res) => {
  const model = await AutoAnalyticalModel.findById(req.params.id)
    .populate('analyticalAccountId', 'name')
    .populate('conditions.vendorId', 'name')
    .populate('conditions.productId', 'name')
    .populate('createdBy', 'name email');
  if (!model) return errorResponse(res, 404, 'Auto-analytical model not found');
  return successResponse(res, 200, 'Auto-analytical model retrieved successfully', model);
});

export const createAutoAnalyticalModel = asyncHandler(async (req, res) => {
  const accountCheck = await verifyAnalyticalAccount(req.body.analyticalAccountId);
  if (!accountCheck.valid) return errorResponse(res, 400, accountCheck.message);
  
  if (req.body.conditions?.vendorId) {
    const vendorCheck = await verifyContact(req.body.conditions.vendorId, 'vendor');
    if (!vendorCheck.valid) return errorResponse(res, 400, vendorCheck.message);
  }
  
  if (req.body.conditions?.productId) {
    const productCheck = await verifyProduct(req.body.conditions.productId);
    if (!productCheck.valid) return errorResponse(res, 400, productCheck.message);
  }
  
  req.body.createdBy = req.user._id;
  const model = await AutoAnalyticalModel.create(req.body);
  return successResponse(res, 201, 'Auto-analytical model created successfully', model);
});

export const updateAutoAnalyticalModel = asyncHandler(async (req, res) => {
  if (req.body.analyticalAccountId) {
    const accountCheck = await verifyAnalyticalAccount(req.body.analyticalAccountId);
    if (!accountCheck.valid) return errorResponse(res, 400, accountCheck.message);
  }
  
  if (req.body.conditions?.vendorId) {
    const vendorCheck = await verifyContact(req.body.conditions.vendorId, 'vendor');
    if (!vendorCheck.valid) return errorResponse(res, 400, vendorCheck.message);
  }
  
  if (req.body.conditions?.productId) {
    const productCheck = await verifyProduct(req.body.conditions.productId);
    if (!productCheck.valid) return errorResponse(res, 400, productCheck.message);
  }
  
  const model = await AutoAnalyticalModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!model) return errorResponse(res, 404, 'Auto-analytical model not found');
  return successResponse(res, 200, 'Auto-analytical model updated successfully', model);
});

export const deleteAutoAnalyticalModel = asyncHandler(async (req, res) => {
  const model = await AutoAnalyticalModel.findByIdAndDelete(req.params.id);
  if (!model) return errorResponse(res, 404, 'Auto-analytical model not found');
  return successResponse(res, 200, 'Auto-analytical model deleted successfully');
});
