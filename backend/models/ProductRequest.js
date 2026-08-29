import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['customer', 'admin'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    productName: {
      type: String,
      required: [true, 'Please provide product name']
    },
    message: {
      type: String,
      required: [true, 'Please provide message']
    },
    status: {
      type: String,
      enum: ['PENDING', 'REPLIED', 'RESOLVED'],
      default: 'PENDING'
    },
    replies: [replySchema]
  },
  { timestamps: true }
);

const ProductRequest = mongoose.model('ProductRequest', productRequestSchema);
export default ProductRequest;
