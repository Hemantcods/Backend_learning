import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderPrice: {
      type: Number,
      requireed: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderItems: {
      type: [orderItemSchema],
    },
    adress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'cancelled', 'delivered'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
