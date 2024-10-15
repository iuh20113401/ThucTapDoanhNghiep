import express from "express";
import {
  getProducts,
  getProduct,
  createProductReview,
  createNewProduct,
  updateProduct,
  removeProductReview,
  deleteProduct,
  getOverview,
  getProductsHome,
} from "../controllers/ProductController.js";
import { protectRoute, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js"; // Use import instead of require

const productRoutes = express.Router();

productRoutes.route("/:page/:perPage").get(getProducts);
productRoutes.route("/").get(getProducts);
productRoutes.route("/overview").get(getOverview);
productRoutes.route("/home").get(getProductsHome);
productRoutes.route("/reviews/:id").post(protectRoute, createProductReview);
productRoutes
  .route("/:productId/:reviewId")
  .put(protectRoute, admin, removeProductReview);
productRoutes
  .route("/:id")
  .get(getProduct)
  .patch(
    protectRoute,
    admin,
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    updateProduct
  )
  .delete(protectRoute, admin, deleteProduct);

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
