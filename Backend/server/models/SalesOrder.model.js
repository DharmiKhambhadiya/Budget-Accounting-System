import mongoose from 'mongoose';
import { generateNumber, generateReferenceNumber } from '../utils/generateNumber.js';

const orderItemSchema = new mongoose.Schema({
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

const salesOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    trim: true
  },
  referenceNumber: {
    type: String,
    unique: true,
    trim: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: [true, 'Customer is required']
  },
  orderDate: {
    type: Date,
    required: [true, 'Order date is required']
  },
  deliveryDate: {
    type: Date
  },
  items: [orderItemSchema],
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
  analyticalAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalyticalAccount'
  },
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'invoiced', 'delivered', 'cancelled'],
    default: 'draft'
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Auto-generate order number and reference number before save
salesOrderSchema.pre('save', async function(next) {
  // Only generate for new documents
  if (this.isNew) {
    // Auto-generate order number if not provided
    if (!this.orderNumber) {
      const SalesOrder = mongoose.model('SalesOrder');
      this.orderNumber = await generateNumber('SO', SalesOrder, 'orderNumber');
    }
    
    // Auto-generate reference number if not provided
    if (!this.referenceNumber) {
      const SalesOrder = mongoose.model('SalesOrder');
      this.referenceNumber = await generateReferenceNumber('REF', SalesOrder, 'referenceNumber');
    }
  }
  
  next();
});

// Calculate amounts before save
salesOrderSchema.pre('save', function(next) {
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
  next();
});

// Indexes (orderNumber and referenceNumber already have unique: true)
salesOrderSchema.index({ customerId: 1 });
salesOrderSchema.index({ orderDate: 1 });
salesOrderSchema.index({ status: 1 });
salesOrderSchema.index({ analyticalAccountId: 1 });
salesOrderSchema.index({ createdBy: 1 });

export default mongoose.model('SalesOrder', salesOrderSchema);
