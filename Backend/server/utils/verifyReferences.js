import Contact from '../models/Contact.model.js';
import Product from '../models/Product.model.js';
import AnalyticalAccount from '../models/AnalyticalAccount.model.js';
import SalesOrder from '../models/SalesOrder.model.js';
import PurchaseOrder from '../models/PurchaseOrder.model.js';
import VendorBill from '../models/VendorBill.model.js';
import CustomerInvoice from '../models/CustomerInvoice.model.js';
import User from '../models/User.model.js';

export const verifyContact = async (contactId, contactType = null) => {
  if (!contactId) return { valid: true };
  const contact = await Contact.findById(contactId);
  if (!contact) return { valid: false, message: `Contact with ID ${contactId} not found` };
  if (contactType && contact.contactType !== contactType) {
    return { valid: false, message: `Contact must be of type ${contactType}` };
  }
  return { valid: true, data: contact };
};

export const verifyProduct = async (productId) => {
  if (!productId) return { valid: true };
  const product = await Product.findById(productId);
  if (!product) return { valid: false, message: `Product with ID ${productId} not found` };
  return { valid: true, data: product };
};

export const verifyAnalyticalAccount = async (accountId) => {
  if (!accountId) return { valid: true };
  const account = await AnalyticalAccount.findById(accountId);
  if (!account) return { valid: false, message: `Analytical account with ID ${accountId} not found` };
  return { valid: true, data: account };
};

export const verifySalesOrder = async (orderId) => {
  if (!orderId) return { valid: true };
  const order = await SalesOrder.findById(orderId);
  if (!order) return { valid: false, message: `Sales order with ID ${orderId} not found` };
  return { valid: true, data: order };
};

export const verifyPurchaseOrder = async (orderId) => {
  if (!orderId) return { valid: true };
  const order = await PurchaseOrder.findById(orderId);
  if (!order) return { valid: false, message: `Purchase order with ID ${orderId} not found` };
  return { valid: true, data: order };
};

export const verifyVendorBill = async (billId) => {
  if (!billId) return { valid: true };
  const bill = await VendorBill.findById(billId);
  if (!bill) return { valid: false, message: `Vendor bill with ID ${billId} not found` };
  return { valid: true, data: bill };
};

export const verifyCustomerInvoice = async (invoiceId) => {
  if (!invoiceId) return { valid: true };
  const invoice = await CustomerInvoice.findById(invoiceId);
  if (!invoice) return { valid: false, message: `Customer invoice with ID ${invoiceId} not found` };
  return { valid: true, data: invoice };
};

export const verifyUser = async (userId) => {
  if (!userId) return { valid: true };
  const user = await User.findById(userId);
  if (!user) return { valid: false, message: `User with ID ${userId} not found` };
  return { valid: true, data: user };
};
