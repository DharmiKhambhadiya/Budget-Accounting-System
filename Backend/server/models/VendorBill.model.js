import mongoose from 'mongoose';
import { generateNumber, generateReferenceNumber } from '../utils/generateNumber.js';

const billItemSchema = new mongoose.Schema({
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

const vendorBillSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    unique: true,
    trim: true
  },
  referenceNumber: {
    type: String,
    unique: true,
    trim: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: [true, 'Vendor is required']
  },
  purchaseOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseOrder'
  },
  billDate: {
    type: Date,
    required: [true, 'Bill date is required']
  },
  dueDate: {
    type: Date
  },
  items: [billItemSchema],
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
    enum: ['draft', 'confirmed', 'paid', 'cancelled'],
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

// Auto-generate bill number and reference number before save
vendorBillSchema.pre('save', async function(next) {
  // Only generate for new documents
  if (this.isNew) {
    // Auto-generate bill number if not provided
    if (!this.billNumber) {
      const VendorBill = mongoose.model('VendorBill');
      this.billNumber = await generateNumber('BILL', VendorBill, 'billNumber');
    }
    
    // Auto-generate reference number if not provided
    if (!this.referenceNumber) {
      const VendorBill = mongoose.model('VendorBill');
      this.referenceNumber = await generateReferenceNumber('REF', VendorBill, 'referenceNumber');
    }
  }
  
  next();
});

// Calculate amounts before save
vendorBillSchema.pre('save', function(next) {
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

// Indexes (billNumber and referenceNumber already have unique: true)
vendorBillSchema.index({ vendorId: 1 });
vendorBillSchema.index({ purchaseOrderId: 1 });
vendorBillSchema.index({ billDate: 1 });
vendorBillSchema.index({ status: 1 });
vendorBillSchema.index({ analyticalAccountId: 1 });
vendorBillSchema.index({ createdBy: 1 });

export default mongoose.model('VendorBill', vendorBillSchema);
