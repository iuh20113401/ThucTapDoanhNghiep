import axios from "axios";
import { setError, setShippingAddress, clearOrder } from "../slices/order";

const URL = `${process.env.REACT_APP_SERVER}`;

export const setAddress = (data) => (dispatch) => {
  dispatch(setShippingAddress(data));
};

export const setPayment = () => async (dispatch, getState) => {
  const {
    cart: { cartItems, subtotal, shipping },
    order: { shippingAddress },
    user: { userInfo },
  } = getState();

  const newOrder = { subtotal, shipping, shippingAddress, cartItems, userInfo };

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(`${URL}/api/checkout`, newOrder, config);
    window.location.assign(data.payUrl);
  } catch (error) {
    setError(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
        ? error.message
        : "An expected error has occured. Please try again later."
    );
  }
};

export const resetOrder = () => async (dispatch) => {
  dispatch(clearOrder());
};
