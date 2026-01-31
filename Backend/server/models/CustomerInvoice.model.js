import mongoose from 'mongoose';
import { generateNumber, generateReferenceNumber } from '../utils/generateNumber.js';

const invoiceItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, 'Unit price cannot be negative']
  },
  taxRate: {
    type: Number,
    default: 0,
    min: [0, 'Tax rate cannot be negative']
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  }
}, { _id: false });

const customerInvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    trim: true
  },
  referenceNumber: {
    type: String,
    unique: true,
    trim: true
  },
  salesOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesOrder'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: [true, 'Customer is required']
  },
  invoiceDate: {
    type: Date,
    required: [true, 'Invoice date is required']
  },
  dueDate: {
    type: Date
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    default: 0,
    min: [0, 'Subtotal cannot be negative']
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: [0, 'Tax amount cannot be negative']
  },
  totalAmount: {
    type: Number,
    default: 0,
    min: [0, 'Total amount cannot be negative']
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: [0, 'Paid amount cannot be negative']
  },
  remainingAmount: {
    type: Number,
    default: function() {
      return this.totalAmount - this.paidAmount;
    }
  },
  analyticalAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalyticalAccount'
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'partially_paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  notes: {
    type: String,
    trim: true
  },
  attachments: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Auto-generate invoice number and reference number before save
customerInvoiceSchema.pre('save', async function(next) {
  // Only generate for new documents
  if (this.isNew) {
    // Auto-generate invoice number if not provided
    if (!this.invoiceNumber) {
      const CustomerInvoice = mongoose.model('CustomerInvoice');
      this.invoiceNumber = await generateNumber('INV', CustomerInvoice, 'invoiceNumber');
    }
    
    // Auto-generate reference number if not provided
    if (!this.referenceNumber) {
      const CustomerInvoice = mongoose.model('CustomerInvoice');
      this.referenceNumber = await generateReferenceNumber('REF', CustomerInvoice, 'referenceNumber');
    }
  }
  
  next();
});

// Calculate amounts and status before save
customerInvoiceSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    this.taxAmount = this.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
    this.totalAmount = this.subtotal + this.taxAmount;
  } else {
    // Set defaults if no items
    this.subtotal = 0;
    this.taxAmount = 0;
    this.totalAmount = 0;
  }
  
  this.remainingAmount = this.totalAmount - this.paidAmount;
  
  // Auto-update status based on payment
  if (this.remainingAmount <= 0 && this.totalAmount > 0) {
    this.status = 'paid';
  } else if (this.paidAmount > 0 && this.remainingAmount > 0) {
    this.status = 'partially_paid';
  } else if (this.dueDate && new Date() > this.dueDate && this.status !== 'paid' && this.status !== 'cancelled') {
    this.status = 'overdue';
  }
  
  next();
});

// Indexes (invoiceNumber and referenceNumber already have unique: true)
customerInvoiceSchema.index({ salesOrderId: 1 });
customerInvoiceSchema.index({ customerId: 1 });
customerInvoiceSchema.index({ invoiceDate: 1 });
customerInvoiceSchema.index({ dueDate: 1 });
customerInvoiceSchema.index({ status: 1 });
customerInvoiceSchema.index({ analyticalAccountId: 1 });
customerInvoiceSchema.index({ createdBy: 1 });

export default mongoose.model('CustomerInvoice', customerInvoiceSchema);
