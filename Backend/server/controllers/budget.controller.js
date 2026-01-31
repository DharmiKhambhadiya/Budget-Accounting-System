import Budget from '../models/Budget.model.js';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import { successResponse, errorResponse } from '../middleware/response.middleware.js';
import { verifyAnalyticalAccount } from '../utils/verifyReferences.js';

export const getBudgets = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.analyticalAccountId) filter.analyticalAccountId = req.query.analyticalAccountId;
  
  const budgets = await Budget.find(filter)
    .populate('analyticalAccountId', 'name')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
  
  return successResponse(res, 200, 'Budgets retrieved successfully', { count: budgets.length, budgets });
});

export const getBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id)
    .populate('analyticalAccountId', 'name')
    .populate('createdBy', 'name email');
  if (!budget) return errorResponse(res, 404, 'Budget not found');
  return successResponse(res, 200, 'Budget retrieved successfully', budget);
});

export const createBudget = asyncHandler(async (req, res) => {
  const accountCheck = await verifyAnalyticalAccount(req.body.analyticalAccountId);
  if (!accountCheck.valid) return errorResponse(res, 400, accountCheck.message);
  
  req.body.createdBy = req.user._id;
  const budget = await Budget.create(req.body);
  return successResponse(res, 201, 'Budget created successfully', budget);
});

export const updateBudget = asyncHandler(async (req, res) => {
  if (req.body.analyticalAccountId) {
    const accountCheck = await verifyAnalyticalAccount(req.body.analyticalAccountId);
    if (!accountCheck.valid) return errorResponse(res, 400, accountCheck.message);
  }
  
  const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!budget) return errorResponse(res, 404, 'Budget not found');
  return successResponse(res, 200, 'Budget updated successfully', budget);
});

export const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findByIdAndDelete(req.params.id);
  if (!budget) return errorResponse(res, 404, 'Budget not found');
  return successResponse(res, 200, 'Budget deleted successfully');
});
