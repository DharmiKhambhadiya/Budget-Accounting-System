import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true
  },
  salesPrice: {
    type: Number,
    default: 0,
    min: [0, 'Sales price cannot be negative']
  },
  purchasePrice: {
    type: Number,
    default: 0,
    min: [0, 'Purchase price cannot be negative']
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
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
productSchema.index({ category: 1 });
productSchema.index({ createdBy: 1 });

export default mongoose.model('Product', productSchema);
