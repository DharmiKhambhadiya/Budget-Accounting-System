import mongoose from 'mongoose';
import { generateNumber } from '../utils/generateNumber.js';

const billPaymentSchema = new mongoose.Schema({
  paymentNumber: {
    type: String,
    unique: true,
    trim: true
  },
  vendorBillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VendorBill',
    required: [true, 'Vendor bill is required']
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: [true, 'Vendor is required']
  },
  paymentDate: {
    type: Date,
    required: [true, 'Payment date is required']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'cheque', 'bank_transfer', 'online', 'other'],
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  referenceNumber: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  analyticalAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalyticalAccount'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Auto-generate payment number before save
billPaymentSchema.pre('save', async function(next) {
  // Only generate for new documents
  if (this.isNew && !this.paymentNumber) {
    const BillPayment = mongoose.model('BillPayment');
    this.paymentNumber = await generateNumber('PAY-BILL', BillPayment, 'paymentNumber');
  }
  
  next();
});

// Indexes (paymentNumber already has unique: true)
billPaymentSchema.index({ vendorBillId: 1 });
billPaymentSchema.index({ vendorId: 1 });
billPaymentSchema.index({ paymentDate: 1 });
billPaymentSchema.index({ status: 1 });
billPaymentSchema.index({ analyticalAccountId: 1 });

export default mongoose.model('BillPayment', billPaymentSchema);
