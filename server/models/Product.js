import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // Thêm slug để tối ưu SEO
    coverImage: {
      type: String,
      required: true,
      default: "./images/productReplace.jpg",
    },
    images: { type: Array, required: true, default: [] },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 5 },
    numberOfReviews: { type: Number, default: 0 },
    subtitle: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    productIsNew: { type: Boolean, required: true },
    colors: [{ ten: String, color: String }],
    sizes: { type: Array, required: true, default: [] },
  },
  { timestamps: true }
);

const Product = mongoose.model("Products", productSchema);

export default Product;
