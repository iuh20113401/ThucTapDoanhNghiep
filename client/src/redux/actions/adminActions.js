import axios from "axios";
import {
  setProductInsertFlag,
  setProducts,
  setProductUpdateFlag,
  setReviewRemovalFlag,
} from "../slices/product";
import {
  setDeliveredFlag,
  setError,
  setLoading,
  resetError,
  getOrders,
  getUsers,
  userDelete,
  orderDelete,
} from "../slices/admin";
const URL = `${process.env.REACT_APP_SERVER}/api`;

export const getAllUsers = () => async (dispatch, getState) => {
  dispatch(setLoading());
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const { data } = await axios.get(`${URL}/users`, config);
    dispatch(getUsers(data));
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

export const deleteUser = (id) => async (dispatch, getState) => {
  dispatch(setLoading());
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const { data } = await axios.delete(`${URL}/users/${id}`, config);
    dispatch(userDelete(data));
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

export const getAllOrders = () => async (dispatch, getState) => {
  dispatch(setLoading());
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const { data } = await axios.get(`${URL}/orders`, config);
    dispatch(getOrders(data));
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

export const deleteOrder = (id) => async (dispatch, getState) => {
  dispatch(setLoading());
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const { data } = await axios.delete(`${URL}/orders/${id}`, config);
    dispatch(orderDelete(data));
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

export const setDelivered = (id) => async (dispatch, getState) => {
  dispatch(setLoading());
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    await axios.put(`${URL}/orders/${id}`, {}, config);
    dispatch(setDeliveredFlag());
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

export const resetErrorAndRemoval = () => async (dispatch) => {
  dispatch(resetError());
};

export const updateProduct = (id, body) => async (dispatch, getState) => {
  dispatch(setLoading());
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  try {
    const { data } = await axios.patch(`${URL}/products/${id}`, body, config);
    dispatch(setProducts(data));
    dispatch(setProductUpdateFlag());
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

export const deleteProduct = (id) => async (dispatch, getState) => {
  dispatch(setLoading());
  const {
    user: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const { data } = await axios.delete(`${URL}/products/${id}`, config);
    dispatch(setProducts(data));
    dispatch(setProductUpdateFlag());
    dispatch(resetError());
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

export const uploadProduct = (newProduct) => async (dispatch, getState) => {
  dispatch(setLoading());
  const {
    user: { userInfo },
  } = getState();
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      // "Content-Type": "application/json",
    },
  };

  try {
    const { data } = await axios.post(`${URL}/products`, newProduct, config);
    dispatch(setProducts(data));
    dispatch(setProductInsertFlag());
  } catch (error) {
    console.log(error);
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

export const removeReview =
  (productId, reviewId) => async (dispatch, getState) => {
    dispatch(setLoading());
    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios.put(
        `${URL}/products/${productId}/${reviewId}`,
        {},
        config
      );
      dispatch(setProducts(data));
      dispatch(setReviewRemovalFlag());
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
