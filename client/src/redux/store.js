import { combineReducers, configureStore } from "@reduxjs/toolkit";
import product from "./slices/product";
import cart from "./slices/cart";
import user from "./slices/user";
import order from "./slices/order";
import admin from "./slices/admin";
import shipping from "./slices/shipping";

const reducer = combineReducers({
  product,
  cart,
  user,
  order,
  admin,
  shipping,
});

export default configureStore({ reducer });
