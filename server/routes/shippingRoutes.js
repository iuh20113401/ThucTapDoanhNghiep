import express from "express";
import {
  getShippingFee,
  getAllShippingFee,
  setShippingFee,
  deleteShippingFee,
  updateShippingFee,
} from "../controllers/shippingController.js";
import { protectRoute, admin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js"; // Use import instead of require

const shippingRoutes = express.Router();

shippingRoutes
  .route("/")
  .get(protectRoute, admin, getAllShippingFee)
  .post(protectRoute, admin, setShippingFee);
shippingRoutes
  .route("/:city/:district")
  .get(getShippingFee)
  .patch(protectRoute, admin, updateShippingFee)
  .delete(protectRoute, admin, deleteShippingFee);

export default shippingRoutes;
