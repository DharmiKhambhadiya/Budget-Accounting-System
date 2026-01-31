import mongoose from 'mongoose';
import { generateNumber } from '../utils/generateNumber.js';

const invoicePaymentSchema = new mongoose.Schema({
  paymentNumber: {
    type: String,
    unique: true,
    trim: true
  },
  customerInvoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerInvoice',
    required: [true, 'Customer invoice is required']
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: [true, 'Customer is required']
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
invoicePaymentSchema.pre('save', async function(next) {
  // Only generate for new documents
  if (this.isNew && !this.paymentNumber) {
    const InvoicePayment = mongoose.model('InvoicePayment');
    this.paymentNumber = await generateNumber('PAY-INV', InvoicePayment, 'paymentNumber');
  }
  
  next();
});

// Update invoice paidAmount when payment is saved
invoicePaymentSchema.post('save', async function() {
  if (this.status === 'completed') {
    const CustomerInvoice = mongoose.model('CustomerInvoice');
    const invoice = await CustomerInvoice.findById(this.customerInvoiceId);
    if (invoice) {
      const InvoicePayment = mongoose.model('InvoicePayment');
      const payments = await InvoicePayment.find({
        customerInvoiceId: this.customerInvoiceId,
        status: 'completed'
      });
      invoice.paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
      await invoice.save();
    }
  }
});

// Indexes (paymentNumber already has unique: true)
invoicePaymentSchema.index({ customerInvoiceId: 1 });
invoicePaymentSchema.index({ customerId: 1 });
invoicePaymentSchema.index({ paymentDate: 1 });
invoicePaymentSchema.index({ status: 1 });
invoicePaymentSchema.index({ analyticalAccountId: 1 });

export default mongoose.model('InvoicePayment', invoicePaymentSchema);
