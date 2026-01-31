import BillPayment from '../models/BillPayment.model.js';
import VendorBill from '../models/VendorBill.model.js';
import Budget from '../models/Budget.model.js';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import { successResponse, errorResponse } from '../middleware/response.middleware.js';
import { verifyVendorBill, verifyContact, verifyAnalyticalAccount } from '../utils/verifyReferences.js';

export const getBillPayments = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.vendorBillId) filter.vendorBillId = req.query.vendorBillId;
  if (req.query.vendorId) filter.vendorId = req.query.vendorId;
  if (req.query.status) filter.status = req.query.status;
  
  const payments = await BillPayment.find(filter)
    .populate('vendorBillId', 'billNumber totalAmount status')
    .populate('vendorId', 'name contactType')
    .populate('analyticalAccountId', 'name')
    .populate('createdBy', 'name email')
    .sort({ paymentDate: -1 });
  
  return successResponse(res, 200, 'Bill payments retrieved successfully', { count: payments.length, payments });
});

export const getBillPayment = asyncHandler(async (req, res) => {
  const payment = await BillPayment.findById(req.params.id)
    .populate('vendorBillId', 'billNumber totalAmount status items')
    .populate('vendorId', 'name contactType')
    .populate('analyticalAccountId', 'name')
    .populate('createdBy', 'name email');
  if (!payment) return errorResponse(res, 404, 'Bill payment not found');
  return successResponse(res, 200, 'Bill payment retrieved successfully', payment);
});

export const createBillPayment = asyncHandler(async (req, res) => {
  const billCheck = await verifyVendorBill(req.body.vendorBillId);
  if (!billCheck.valid) return errorResponse(res, 400, billCheck.message);
  
  const vendorCheck = await verifyContact(req.body.vendorId, 'vendor');
  if (!vendorCheck.valid) return errorResponse(res, 400, vendorCheck.message);
  
  if (req.body.analyticalAccountId) {
    const accountCheck = await verifyAnalyticalAccount(req.body.analyticalAccountId);
    if (!accountCheck.valid) return errorResponse(res, 400, accountCheck.message);
  }
  
  req.body.createdBy = req.user._id;
  
  const vendorBill = await VendorBill.findById(req.body.vendorBillId);
  if (!vendorBill) return errorResponse(res, 404, 'Vendor bill not found');
  
  const payment = await BillPayment.create(req.body);
  
  if (payment.status === 'completed') {
    const payments = await BillPayment.find({ vendorBillId: vendorBill._id, status: 'completed' });
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    if (totalPaid >= vendorBill.totalAmount) {
      vendorBill.status = 'paid';
      await vendorBill.save();
    }
    
    if (payment.analyticalAccountId) {
      await Budget.updateMany(
        { analyticalAccountId: payment.analyticalAccountId },
        { $inc: { spentAmount: payment.amount } }
      );
    }
  }
  
  return successResponse(res, 201, 'Bill payment created successfully', payment);
});

export const updateBillPayment = asyncHandler(async (req, res) => {
  if (req.body.vendorBillId) {
    const billCheck = await verifyVendorBill(req.body.vendorBillId);
    if (!billCheck.valid) return errorResponse(res, 400, billCheck.message);
  }
  
  if (req.body.vendorId) {
    const vendorCheck = await verifyContact(req.body.vendorId, 'vendor');
    if (!vendorCheck.valid) return errorResponse(res, 400, vendorCheck.message);
  }
  
  if (req.body.analyticalAccountId) {
    const accountCheck = await verifyAnalyticalAccount(req.body.analyticalAccountId);
    if (!accountCheck.valid) return errorResponse(res, 400, accountCheck.message);
  }
  
  const payment = await BillPayment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!payment) return errorResponse(res, 404, 'Bill payment not found');
  
  if (payment.status === 'completed' && payment.analyticalAccountId) {
    const payments = await BillPayment.find({ analyticalAccountId: payment.analyticalAccountId, status: 'completed' });
    const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);
    await Budget.updateMany(
      { analyticalAccountId: payment.analyticalAccountId },
      { $set: { spentAmount: totalSpent } }
    );
  }
  
  return successResponse(res, 200, 'Bill payment updated successfully', payment);
});

export const deleteBillPayment = asyncHandler(async (req, res) => {
  const payment = await BillPayment.findByIdAndDelete(req.params.id);
  if (!payment) return errorResponse(res, 404, 'Bill payment not found');
  return successResponse(res, 200, 'Bill payment deleted successfully');
});
