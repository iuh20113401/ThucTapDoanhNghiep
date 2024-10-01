import axios from "axios";
import {
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

export const getAllUsers = () => async (dispatch, getState) => {
  setLoading();
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
    const { data } = await axios.get("http://localhost:5000/api/users", config);
    dispatch(getUsers(data));
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

export const deleteUser = (id) => async (dispatch, getState) => {
  setLoading();
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
    const { data } = await axios.delete(
      `http://localhost:5000/api/users/${id}`,
      config
    );
    dispatch(userDelete(data));
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

export const getAllOrders = () => async (dispatch, getState) => {
  setLoading();
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
    const { data } = await axios.get(
      "http://localhost:5000/api/orders",
      config
    );
    dispatch(getOrders(data));
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

export const deleteOrder = (id) => async (dispatch, getState) => {
  setLoading();
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
    const { data } = await axios.delete(
      `http://localhost:5000/api/orders/${id}`,
      config
    );
    dispatch(orderDelete(data));
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

export const setDelivered = (id) => async (dispatch, getState) => {
  setLoading();
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
    await axios.put(`http://localhost:5000/api/orders/${id}`, {}, config);
    dispatch(setDeliveredFlag());
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

export const resetErrorAndRemoval = () => async (dispatch) => {
  dispatch(resetError());
};

export const updateProduct =
  (
    brand,
    name,
    category,
    stock,
    price,
    id,
    productIsNew,
    description,
    subtitle,
    stripeId,
    imageOne,
    imageTwo
  ) =>
  async (dispatch, getState) => {
    setLoading();
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
        "http://localhost:5000/api/products",
        {
          brand,
          name,
          category,
          stock,
          price,
          id,
          productIsNew,
          description,
          subtitle,
          stripeId,
          imageOne,
          imageTwo,
        },
        config
      );
      dispatch(setProducts(data));
      dispatch(setProductUpdateFlag());
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

export const deleteProduct = (id) => async (dispatch, getState) => {
  setLoading();
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
    const { data } = await axios.delete(
      `http://localhost:5000/api/products/${id}`,
      config
    );
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
  setLoading();
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
    const { data } = await axios.post(
      `http://localhost:5000/api/products`,
      newProduct,
      config
    );
    dispatch(setProducts(data));
    dispatch(setProductUpdateFlag());
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

export const removeReview =
  (productId, reviewId) => async (dispatch, getState) => {
    setLoading();
    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };
    console.log("asdfdsaf");
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/products/${productId}/${reviewId}`,
        {},
        config
      );
      dispatch(setProducts(data));
      dispatch(setReviewRemovalFlag());
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
