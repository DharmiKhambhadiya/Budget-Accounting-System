import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Budget name is required'],
    trim: true
  },
  analyticalAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalyticalAccount',
    required: [true, 'Analytical account is required']
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Budget amount cannot be negative']
  },
  period: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    periodType: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly', 'custom'],
      required: true
    }
  },
  spentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Spent amount cannot be negative']
  },
  revisedAmount: {
    type: Number,
    default: 0,
    min: [0, 'Revised amount cannot be negative']
  },
  remainingAmount: {
    type: Number,
    default: function() {
      return this.amount - this.spentAmount;
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate remaining amount before save
budgetSchema.pre('save', function(next) {
  this.remainingAmount = this.amount - this.spentAmount;
  next();
});

// Indexes
budgetSchema.index({ analyticalAccountId: 1 });
budgetSchema.index({ 'period.startDate': 1 });
budgetSchema.index({ 'period.endDate': 1 });
budgetSchema.index({ createdBy: 1 });

export default mongoose.model('Budget', budgetSchema);
