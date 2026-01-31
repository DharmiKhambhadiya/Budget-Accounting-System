import mongoose from 'mongoose';

const autoAnalyticalModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Model name is required'],
    trim: true
  },
  ruleType: {
    type: String,
    required: [true, 'Rule type is required'],
    enum: ['vendor_based', 'product_based', 'amount_based', 'custom']
  },
  conditions: {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact'
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    minAmount: {
      type: Number,
      min: 0
    },
    maxAmount: {
      type: Number,
      min: 0
    },
    keywords: [{
      type: String,
      trim: true
    }]
  },
  analyticalAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalyticalAccount',
    required: [true, 'Analytical account is required']
  },
  priority: {
    type: Number,
    default: 0,
    min: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
autoAnalyticalModelSchema.index({ analyticalAccountId: 1 });
autoAnalyticalModelSchema.index({ 'conditions.vendorId': 1 });
autoAnalyticalModelSchema.index({ 'conditions.productId': 1 });
autoAnalyticalModelSchema.index({ priority: -1 }); // Descending for priority sorting

export default mongoose.model('AutoAnalyticalModel', autoAnalyticalModelSchema);
