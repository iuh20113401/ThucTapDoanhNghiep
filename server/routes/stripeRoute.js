import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import https from "https";
import axios from "axios";
import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeRoute = express.Router();

const stripePayment = async (req, res) => {
  const data = req.body;

  let lineItems = [];

  if (data.shipping == 14.99) {
    lineItems.push({
      price: process.env.EXPRESS_SHIPPING_ID,
      quantity: 1,
    });
  } else {
    lineItems.push({
      price: process.env.STANDARD_SHIPPING_ID,
      quantity: 1,
    });
  }

  data.cartItems.forEach((item) => {
    lineItems.push({
      price: item.stripeId,
      quantity: item.qty,
    });
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  const order = new Order({
    orderItems: data.cartItems,
    user: data.userInfo._id,
    username: data.userInfo.name,
    email: data.userInfo.email,
    shippingAddress: data.shippingAddress,
    shippingPrice: data.shipping,
    subtotal: data.subtotal,
    totalPrice: Number(data.subtotal + data.shipping).toFixed(2),
  });

  const newOrder = await order.save();

  data.cartItems.forEach(async (cartItem) => {
    let product = await Product.findById(cartItem.id);
    product.stock = product.stock - cartItem.qty;
    product.save();
  });

  res.send(
    JSON.stringify({
      orderId: newOrder._id.toString(),
      url: session.url,
    })
  );
};
stripeRoute.route("/checkout-notify", async (req, res) => {
  const { orderId, resultCode } = req.body;
  if (resultCode == 0) {
    const order = await Order.findByIdAndUpdate(
      { orderId },
      { paymentStatus: "Đã thanh toán" }
    );
    console.log(`Payment for order ${orderId} successful`);
  } else {
    const order = await Order.findByIdAndUpdate(
      { orderId },
      { paymentStatus: "Thanh toán thất bại" }
    );
    console.log(`Payment for order ${orderId} failed`);
  }
  res.status(200).send("Received");
});
stripeRoute.route("/").post(protectRoute, async (req, res) => {
  const data = req.body;

  try {
    var accessKey = "F8BBA842ECF85";
    var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    var orderInfo = "pay with MoMo";
    var partnerCode = "MOMO";
    var redirectUrl = "http://localhost:3000/success";
    var ipnUrl = "http://localhost:5000/api/checkout-notify";
    var requestType = "payWithMethod";
    var amount = +data.subtotal + +Math.ceil(data.shipping);
    var orderId = data.userInfo._id.slice(-5, -1) + new Date().getTime();
    console.log(orderId);
    var requestId = orderId;
    var extraData = "";
    var paymentCode =
      "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";
    var orderGroupId = "";
    var autoCapture = true;
    var lang = "vi";

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);
    //signature
    var signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");
    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });
    //Create the HTTPS objects
    const options = {
      url: "https://test-payment.momo.vn/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };
    let result;

    result = await axios(options);
    const order = new Order({
      orderId: data.userInfo._id.slice(-5, -1) + new Date().getTime(),
      orderItems: data.cartItems,
      user: data.userInfo._id,
      username: data.userInfo.name,
      email: data.userInfo.email,
      shippingAddress: data.shippingAddress,
      shippingPrice: data.shipping,
      subtotal: data.subtotal,
      totalPrice: Number(data.subtotal + data.shipping).toFixed(2),
      payUrl: result.data.payUrl,
    });

    const newOrder = await order.save();

    data.cartItems.forEach(async (cartItem) => {
      let product = await Product.findById(cartItem.id);
      product.stock = product.stock - cartItem.qty;
      product.save();
    });

    return res
      .status(200)
      .json({ orderId: newOrder._id.toString(), ...result.data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "server error",
    });
  }
});

export default stripeRoute;
