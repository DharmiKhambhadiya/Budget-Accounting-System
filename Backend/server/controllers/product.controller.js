import Product from '../models/Product.model.js';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import { successResponse, errorResponse } from '../middleware/response.middleware.js';

export const getProducts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  
  const products = await Product.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
  
  return successResponse(res, 200, 'Products retrieved successfully', { count: products.length, products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('createdBy', 'name email');
  if (!product) return errorResponse(res, 404, 'Product not found');
  return successResponse(res, 200, 'Product retrieved successfully', product);
});

export const createProduct = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user._id;
  const product = await Product.create(req.body);
  return successResponse(res, 201, 'Product created successfully', product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return errorResponse(res, 404, 'Product not found');
  return successResponse(res, 200, 'Product updated successfully', product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return errorResponse(res, 404, 'Product not found');
  return successResponse(res, 200, 'Product deleted successfully');
});
