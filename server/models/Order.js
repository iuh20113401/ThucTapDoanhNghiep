import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, trim: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    username: { type: String, required: true, ref: "User" },
    email: { type: String, required: true, ref: "User" },
    orderItems: [
      {
        name: { type: String, required: true },
        color: { type: String },
        size: { type: String },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      city: { type: String, required: true },
      district: { type: String, required: true },
      address: { type: String, required: true },
    },
    shippingPrice: { type: Number, default: 0.0 },
    payUrl: { type: String, trim: true },
    totalPrice: { type: Number, default: 0.0 },
    subtotal: { type: Number, default: 0.0 },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    paymentStatus: { type: String, default: "Đang chờ" },
    orderStatus: { type: String, default: "Created" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Orders", orderSchema);
export default Order;
