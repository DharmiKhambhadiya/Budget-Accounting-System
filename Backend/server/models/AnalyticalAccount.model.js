import mongoose from 'mongoose';

const analyticalAccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Analytical account name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  accountType: {
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

// Indexes (name already has unique: true, so no need to index again)
analyticalAccountSchema.index({ createdBy: 1 });

export default mongoose.model('AnalyticalAccount', analyticalAccountSchema);
