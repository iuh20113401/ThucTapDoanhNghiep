import express from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import { admin, protectRoute } from "../middleware/authMiddleware.js";

const orderRoutes = express.Router();

const getOrders = async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
};

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (order) {
    res.json(order);
  } else {
    res.status(404).send("Order not found.");
    throw new Error("Order not found.");
  }
});

const setDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).send("Order could not be uploaded.");
    throw new Error("Order could not be updated.");
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404).send("Order not found.");
    throw new Error("Order not found.");
  }
});

const updateOrderToShipped = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isShipped = true;
    order.shippedAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).send("Order not found.");
    throw new Error("Order not found.");
  }
});

const updateOrderToCancelled = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isCancelled = true;
    order.cancelledAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).send("Order not found.");
    throw new Error("Order not found.");
  }
});

orderRoutes.route("/").get(protectRoute, admin, getOrders);
orderRoutes
  .route("/:id")
  .get(protectRoute, admin, getOrderById)
  .put(protectRoute, admin, setDelivered)
  .delete(protectRoute, admin, deleteOrder);
orderRoutes.route("/:id/ship").put(protectRoute, admin, updateOrderToShipped);
orderRoutes
  .route("/:id/cancel")
  .put(protectRoute, admin, updateOrderToCancelled);
export default orderRoutes;
