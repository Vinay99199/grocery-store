import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    brand: {
      type: String,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    image: {
      type: String,
      default: null
    },
    mrp: {
      type: Number,
      required: [true, 'Please provide MRP']
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Please provide selling price']
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      default: 0
    },
    unit: {
      type: String,
      default: 'kg' // kg, liter, piece, pack, etc.
    },
    isActive: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
