import mongoose from 'mongoose';
import { generateNumber } from '../utils/generateNumber.js';

const purchaseOrderItemSchema = new mongoose.Schema({
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
    required: [true, 'Unit price is required'],
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

const purchaseOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    trim: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: [true, 'Vendor is required']
  },
  orderDate: {
    type: Date,
    required: [true, 'Order date is required']
  },
  expectedDeliveryDate: {
    type: Date
  },
  items: [purchaseOrderItemSchema],
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
    enum: ['draft', 'sent', 'confirmed', 'received', 'cancelled'],
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

// Auto-generate order number before save
purchaseOrderSchema.pre('save', async function(next) {
  // Only generate for new documents
  if (this.isNew && !this.orderNumber) {
    const PurchaseOrder = mongoose.model('PurchaseOrder');
    this.orderNumber = await generateNumber('PO', PurchaseOrder, 'orderNumber');
  }
  
  next();
});

// Calculate amounts before save
purchaseOrderSchema.pre('save', function(next) {
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

// Indexes (orderNumber already has unique: true)
purchaseOrderSchema.index({ vendorId: 1 });
purchaseOrderSchema.index({ orderDate: 1 });
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ analyticalAccountId: 1 });
purchaseOrderSchema.index({ createdBy: 1 });

export default mongoose.model('PurchaseOrder', purchaseOrderSchema);
