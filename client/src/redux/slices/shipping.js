import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  error: null,
  shippingLocations: null,
  shippingFeeUpdated: false,
  loading: false,
};

export const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
    setShippingLocations: (state, { payload }) => {
      console.log(payload);
      state.shippingLocations = payload;
      state.error = null;
      state.loading = false;
    },
    setShippingFeeUpdated: (state, { payload }) => {
      if (payload) {
        const { city, district, newShippingFee } = payload;
        state.shippingLocations = state.shippingLocations.map((location) => {
          location.shippingFee =
            location.city === city &&
            (location.districtName === district ||
              !location.districtName.length)
              ? newShippingFee
              : location.shippingFee;
          return location;
        });
      }
      state.shippingFeeUpdated = true;
      state.loading = false;
      state.error = null;
    },
    resetShippingError: (state) => {
      state.error = null;
      state.loading = false;
      state.shippingFeeUpdated = false;
    },
    setShippingFeeDeleted: (state, { payload }) => {
      state.shippingLocations = payload;
      state.loading = false;
    },
  },
});

export const {
  setError,
  setLoading,
  setShippingLocations,
  setShippingFeeUpdated,
  resetShippingError,
  setShippingFeeDeleted,
} = shippingSlice.actions;

export default shippingSlice.reducer;

export const shippingSelector = (state) => state.shipping;
