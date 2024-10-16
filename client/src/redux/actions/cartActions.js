import axios from "axios";
import {
  setError,
  setLoading,
  setShippingCosts,
  cartItemAdd,
  cartItemRemoval,
  clearCart,
} from "../slices/cart";
const URL = `${process.env.REACT_APP_SERVER}/api/products`;

export const addCartItem = (id, qty, color, size) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axios.get(`${URL}/${id}`);
    const itemToAdd = {
      id: data._id,
      name: data.name,
      subtitle: data.subtitle,
      image: data.images[0],
      coverImage: data.coverImage,
      price: data.price,
      stock: data.stock,
      brand: data.brand,
      qty,
      stripeId: data.stripeId,
      color,
      size,
    };

    dispatch(cartItemAdd(itemToAdd));
  } catch (error) {
    dispatch(
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
          ? error.message
          : "An expected error has occured. Please try again later."
      )
    );
  }
};

export const removeCartItem = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(cartItemRemoval(id));
};

export const setShipping = (value) => async (dispatch) => {
  dispatch(setShippingCosts(value));
};

export const resetCart = () => (dispatch) => {
  dispatch(clearCart);
};
