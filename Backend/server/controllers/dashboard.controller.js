import Budget from '../models/Budget.model.js';
import VendorBill from '../models/VendorBill.model.js';
import CustomerInvoice from '../models/CustomerInvoice.model.js';
import BillPayment from '../models/BillPayment.model.js';
import InvoicePayment from '../models/InvoicePayment.model.js';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import { successResponse, errorResponse } from '../middleware/response.middleware.js';

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const budgets = await Budget.find().populate('analyticalAccountId', 'name');
  
  const totalBudgetAmount = budgets.reduce((sum, budget) => sum + (budget.revisedAmount || budget.amount), 0);
  
  const completedBillPayments = await BillPayment.find({ status: 'completed' }).select('amount');
  const totalSpentAmount = completedBillPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalRemainingAmount = totalBudgetAmount - totalSpentAmount;
  const budgetUtilizationPercentage = totalBudgetAmount > 0 
    ? ((totalSpentAmount / totalBudgetAmount) * 100).toFixed(2) 
    : 0;

  const allBillPayments = await BillPayment.find({ 
    status: 'completed',
    analyticalAccountId: { $ne: null }
  }).select('analyticalAccountId amount');

  const accountSpentMap = {};
  allBillPayments.forEach(payment => {
    const accountId = payment.analyticalAccountId?.toString();
    if (accountId) {
      if (!accountSpentMap[accountId]) {
        accountSpentMap[accountId] = 0;
      }
      accountSpentMap[accountId] += payment.amount;
    }
  });

  const budgetVsActual = budgets.map(budget => {
    const budgetAmount = budget.revisedAmount || budget.amount;
    const accountId = budget.analyticalAccountId?._id?.toString() || budget.analyticalAccountId?.toString();
    const spent = accountSpentMap[accountId] || 0;
    const remaining = budgetAmount - spent;
    const usedPercentage = budgetAmount > 0 ? ((spent / budgetAmount) * 100).toFixed(2) : 0;
    
    return {
      analyticalAccountName: budget.analyticalAccountId?.name || 'N/A',
      budgetAmount,
      spent,
      remaining,
      usedPercentage: parseFloat(usedPercentage)
    };
  });

  const recentInvoices = await CustomerInvoice.find()
    .populate('customerId', 'name')
    .sort({ invoiceDate: -1 })
    .limit(10)
    .select('invoiceNumber invoiceDate totalAmount remainingAmount status');

  const pendingVendorBills = await VendorBill.find({
    status: { $in: ['draft', 'confirmed'] }
  })
    .populate('vendorId', 'name')
    .sort({ billDate: -1 })
    .select('_id billNumber billDate dueDate totalAmount status');

  const unpaidInvoices = await CustomerInvoice.find({
    status: { $in: ['sent', 'partially_paid', 'overdue'] }
  })
    .populate('customerId', 'name')
    .sort({ invoiceDate: -1 })
    .select('invoiceNumber invoiceDate totalAmount remainingAmount status');

  const billIds = pendingVendorBills.map(bill => bill._id);
  const billPayments = await BillPayment.find({
    vendorBillId: { $in: billIds },
    status: 'completed'
  }).select('vendorBillId amount');

  const billPaymentMap = {};
  billPayments.forEach(payment => {
    if (!billPaymentMap[payment.vendorBillId]) {
      billPaymentMap[payment.vendorBillId] = 0;
    }
    billPaymentMap[payment.vendorBillId] += payment.amount;
  });

  const pendingBillsWithRemaining = pendingVendorBills.map(bill => {
    const paidAmount = billPaymentMap[bill._id] || 0;
    return {
      billId: bill.billNumber,
      date: bill.billDate,
      dueDate: bill.dueDate,
      amount: bill.totalAmount,
      remainingAmount: bill.totalAmount - paidAmount,
      status: bill.status
    };
  });

  const unpaidInvoicesFormatted = unpaidInvoices.map(invoice => ({
    invoiceId: invoice.invoiceNumber,
    date: invoice.invoiceDate,
    amount: invoice.totalAmount,
    remainingAmount: invoice.remainingAmount || invoice.totalAmount - (invoice.paidAmount || 0),
    status: invoice.status
  }));

  const recentInvoicesFormatted = recentInvoices.map(invoice => ({
    invoiceNumber: invoice.invoiceNumber,
    date: invoice.invoiceDate,
    amount: invoice.totalAmount,
    remainingAmount: invoice.remainingAmount || invoice.totalAmount - (invoice.paidAmount || 0),
    status: invoice.status
  }));

  return successResponse(res, 200, 'Admin dashboard data retrieved successfully', {
    overallStats: {
      totalBudgetAmount,
      totalSpentAmount,
      totalRemainingAmount,
      budgetUtilizationPercentage: parseFloat(budgetUtilizationPercentage)
    },
    budgetVsActualByAnalyticalAccount: budgetVsActual,
    recentCustomerInvoices: recentInvoicesFormatted,
    pendingVendorBills: pendingBillsWithRemaining,
    unpaidInvoices: unpaidInvoicesFormatted
  });
});

export const getUserDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const invoices = await CustomerInvoice.find({ createdBy: userId })
    .select('totalAmount paidAmount remainingAmount status invoiceDate invoiceNumber');

  const totalInvoices = invoices.length;
  const paidAmount = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const pendingAmount = invoices.reduce((sum, inv) => sum + (inv.remainingAmount || inv.totalAmount - (inv.paidAmount || 0)), 0);
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  let paidPercentage = 0;
  let pendingPercentage = 0;
  
  if (totalAmount > 0) {
    paidPercentage = ((paidAmount / totalAmount) * 100).toFixed(2);
    pendingPercentage = ((pendingAmount / totalAmount) * 100).toFixed(2);
  }

  const recentActivities = [];

  const recentInvoices = await CustomerInvoice.find({ createdBy: userId })
    .populate('customerId', 'name')
    .sort({ createdAt: -1 })
    .limit(3)
    .select('invoiceNumber invoiceDate totalAmount status createdAt');

  recentInvoices.forEach(invoice => {
    recentActivities.push({
      type: 'invoice_created',
      description: `Invoice ${invoice.invoiceNumber} created`,
      amount: invoice.totalAmount,
      date: invoice.createdAt,
      status: invoice.status
    });
  });

  const recentPayments = await InvoicePayment.find({ 
    createdBy: userId 
  })
    .populate('customerInvoiceId', 'invoiceNumber')
    .sort({ createdAt: -1 })
    .limit(2)
    .select('paymentNumber amount paymentDate status createdAt');

  recentPayments.forEach(payment => {
    recentActivities.push({
      type: 'payment_received',
      description: `Payment ${payment.paymentNumber} received for Invoice ${payment.customerInvoiceId?.invoiceNumber || 'N/A'}`,
      amount: payment.amount,
      date: payment.createdAt,
      status: payment.status
    });
  });

  recentActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
  const topRecentActivities = recentActivities.slice(0, 5);

  return successResponse(res, 200, 'User dashboard data retrieved successfully', {
    overallStats: {
      totalInvoices,
      paidAmount,
      pendingAmount,
      paidPercentage: parseFloat(paidPercentage),
      pendingPercentage: parseFloat(pendingPercentage)
    },
    recentActivities: topRecentActivities
  });
});
