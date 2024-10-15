import axios from "axios";
import {
  setShippingLocations,
  setError,
  setLoading,
  setShippingFeeUpdated,
} from "../slices/shipping";
import { setShippingFeeDeleted } from "../slices/shipping";
import { setShipping } from "./cartActions";
const URL = process.env.REACT_APP_SERVER;
export const getAllShippingFees = () => async (dispatch, getState) => {
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
    const { data } = await axios.get(`${URL}/api/shipping`, config);
    dispatch(setShippingLocations(data));
  } catch (error) {
    setError(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
        ? error.message
        : "An error occurred while fetching shipping fees."
    );
  }
};

export const setShippingFee =
  (city, district, shippingFee) => async (dispatch, getState) => {
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
      await axios.post(
        `${URL}/api/shipping`,
        { city, district, shippingFee },
        config
      );
      dispatch(setShippingFeeUpdated());
      dispatch(getAllShippingFees());
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
          ? error.message
          : "An error occurred while setting the shipping fee."
      );
    }
  };

export const getShippingFee =
  (city, district) => async (dispatch, getState) => {
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
      let { data } = await axios.get(
        `${URL}/api/shipping/${city}/${district}`,
        config
      );
      data = data.data;
      dispatch(setShippingLocations(data));
      dispatch(setShipping({ city, district, shippingFee: data }));
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
          ? error.message
          : "An error occurred while retrieving shipping fee."
      );
    }
  };

// Action to update an existing shipping fee
export const updateShippingFee =
  (city, district, newShippingFee) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    const {
      user: { userInfo },
    } = getState();
    if (!district.length || !district) district = undefined;
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      await axios.patch(
        `${URL}/api/shipping/${city}/${district}`,
        { newShippingFee },
        config
      );
      dispatch(setShippingFeeUpdated({ city, district, newShippingFee }));
    } catch (error) {
      dispatch(
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : "An error occurred while updating the shipping fee."
        )
      );
    }
  };

// Action to delete a shipping fee for a city and district
export const deleteShippingFee =
  (city, district) => async (dispatch, getState) => {
    dispatch(setLoading(true));

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
      await axios.delete(`${URL}/api/shipping/${city}/${district}`, config);
      dispatch(setShippingFeeDeleted(city, district));
    } catch (error) {
      dispatch(
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : "An error occurred while deleting the shipping fee."
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
