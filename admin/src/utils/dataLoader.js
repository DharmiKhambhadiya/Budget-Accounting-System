// Data loader utility to fetch static JSON data
import usersData from '../data/users.json';
import contactsData from '../data/contacts.json';
import productsData from '../data/products.json';
import analyticalAccountsData from '../data/analytical_accounts.json';
import budgetsData from '../data/budgets.json';
import autoAnalyticalModelsData from '../data/auto_analytical_models.json';
import purchaseOrdersData from '../data/purchase_orders.json';
import salesOrdersData from '../data/sales_orders.json';
import vendorBillsData from '../data/vendor_bills.json';
import customerInvoicesData from '../data/customer_invoices.json';
import billPaymentsData from '../data/bill_payments.json';
import invoicePaymentsData from '../data/invoice_payments.json';

export const getUsers = () => usersData;
export const getContacts = () => contactsData;
export const getProducts = () => productsData;
export const getAnalyticalAccounts = () => analyticalAccountsData;
export const getBudgets = () => budgetsData;
export const getAutoAnalyticalModels = () => autoAnalyticalModelsData;
export const getPurchaseOrders = () => purchaseOrdersData;
export const getSalesOrders = () => salesOrdersData;
export const getVendorBills = () => vendorBillsData;
export const getCustomerInvoices = () => customerInvoicesData;
export const getBillPayments = () => billPaymentsData;
export const getInvoicePayments = () => invoicePaymentsData;

// Helper functions to get related data
export const getContactById = (id) => contactsData.find(c => c.id === id);
export const getProductById = (id) => productsData.find(p => p.id === id);
export const getAnalyticalAccountById = (id) => analyticalAccountsData.find(a => a.id === id);
export const getUserById = (id) => usersData.find(u => u.id === id);

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
