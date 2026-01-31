import AnalyticalAccount from '../models/AnalyticalAccount.model.js';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import { successResponse, errorResponse } from '../middleware/response.middleware.js';

export const getAnalyticalAccounts = asyncHandler(async (req, res) => {
  const accounts = await AnalyticalAccount.find()
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
  return successResponse(res, 200, 'Analytical accounts retrieved successfully', { count: accounts.length, accounts });
});

export const getAnalyticalAccount = asyncHandler(async (req, res) => {
  const account = await AnalyticalAccount.findById(req.params.id).populate('createdBy', 'name email');
  if (!account) return errorResponse(res, 404, 'Analytical account not found');
  return successResponse(res, 200, 'Analytical account retrieved successfully', account);
});

export const createAnalyticalAccount = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user._id;
  const account = await AnalyticalAccount.create(req.body);
  return successResponse(res, 201, 'Analytical account created successfully', account);
});

export const updateAnalyticalAccount = asyncHandler(async (req, res) => {
  const account = await AnalyticalAccount.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!account) return errorResponse(res, 404, 'Analytical account not found');
  return successResponse(res, 200, 'Analytical account updated successfully', account);
});

export const deleteAnalyticalAccount = asyncHandler(async (req, res) => {
  const account = await AnalyticalAccount.findByIdAndDelete(req.params.id);
  if (!account) return errorResponse(res, 404, 'Analytical account not found');
  return successResponse(res, 200, 'Analytical account deleted successfully');
});
