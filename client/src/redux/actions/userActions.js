import axios from "axios";
import {
  setUserOrders,
  setError,
  setLoading,
  setServerResponseStatus,
  setServerResponseMsg,
  userLogin,
  userLogout,
  verificationEmail,
  stateReset,
} from "../slices/user";

import { clearCart } from "../slices/cart";
const URL = "http://localhost:5000/api/users";
export const login = (email, password) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(
      `${URL}/login`,
      { email, password },
      config
    );

    dispatch(userLogin(data));
    localStorage.setItem("userInfo", JSON.stringify(data));
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

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cartItems");
  dispatch(clearCart());
  dispatch(userLogout());
};

export const register = (name, email, password) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(
      "http://localhost:5000/api/users/register",
      { name, email, password },
      config
    );

    dispatch(userLogin(data));
    localStorage.setItem("userInfo", JSON.stringify(data));
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

export const verifyEmail = (token) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    await axios.get(`${URL}/verify-email`, config);

    dispatch(verificationEmail());
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      userInfo.active = true;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
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

export const sendResetEmail = (email) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const config = { headers: { "Content-Type": "application/json" } };

    const { data, status } = await axios.post(
      `${URL}/password-reset-request`,
      { email },
      config
    );

    dispatch(setServerResponseMsg(data));
    dispatch(setServerResponseStatus(status));
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

export const resetPassword = (password, token) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const { data, status } = await axios.post(
      `${URL}/password-reset`,
      { password },
      config
    );
    dispatch(setServerResponseMsg(data, status));
    dispatch(setServerResponseStatus(status));
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

export const resetState = () => async (dispatch) => {
  dispatch(stateReset());
};

export const googleLogin =
  (googleId, email, name, googleImage) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const config = { headers: { "Content-Type": "application/json" } };

      const { data } = await axios.post(
        `${URL}/google-login`,
        { googleId, email, name, googleImage },
        config
      );
      dispatch(userLogin(data));
      localStorage.setItem("userInfo", JSON.stringify(data));
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

export const getUserOrders = () => async (dispatch, getState) => {
  dispatch(setLoading(true));

  const {
    user: { userInfo },
  } = getState();

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.get(`${URL}/${userInfo._id}`, config);
    dispatch(setUserOrders(data));
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
