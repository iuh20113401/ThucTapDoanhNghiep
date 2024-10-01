import express from "express";
import {
  getProducts,
  getProduct,
  createProductReview,
  createNewProduct,
  updateProduct,
  removeProductReview,
  deleteProduct,
} from "../controllers/ProductController.js";
import { protectRoute, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js"; // Use import instead of require

const productRoutes = express.Router();

productRoutes.route("/:page/:perPage").get(getProducts);
productRoutes.route("/").get(getProducts);
productRoutes.route("/:id").get(getProduct);
productRoutes.route("/reviews/:id").post(protectRoute, createProductReview);
productRoutes.route("/:id").delete(protectRoute, admin, deleteProduct);
productRoutes.route("/").put(protectRoute, admin, updateProduct);
productRoutes
  .route("/:productId/:reviewId")
  .put(protectRoute, admin, removeProductReview);
productRoutes.route("/").post(
  protectRoute,
  admin,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createNewProduct
);

export default productRoutes;
