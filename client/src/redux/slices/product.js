import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loading: false,
  error: null,
  products: [],
  productColors: [],
  productRatings: [],
  productSizes: [],
  productBrands: [],
  minPrice: 0,
  maxPrice: 999999999,
  mostSaleOffProducts: [],
  mostSoldProducts: [],
  product: null,
  pagination: {},
  favoritesToggled: false,
  reviewed: false,
  favorites: JSON.parse(localStorage.getItem("favorites")) ?? [],
  reviewRemoval: false,
  productUpdate: false,
  productInsert: false,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setProductsHome: (state, { payload }) => {
      const { mostSaleOffProducts, mostSoldProducts } = payload;
      state.loading = false;
      state.error = null;
      state.mostSaleOffProducts = mostSaleOffProducts;
      state.mostSoldProducts = mostSoldProducts;
      state.reviewRemoval = false;
    },
    setProducts: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.products = payload;

      state.reviewRemoval = false;
    },
    setProductsOveview: (state, { payload }) => {
      const {
        distinctSizes,
        distinctBrands,
        distinctColors,
        distinctRatings,
        minPrice,
        maxPrice,
      } = payload;
      state.loading = false;
      state.error = null;
      state.productBrands = distinctBrands;
      state.productColors = distinctColors;
      state.productSizes = distinctSizes;
      state.productRatings = distinctRatings;
      state.minPrice = minPrice;
      state.maxPrice = maxPrice;
      state.reviewRemoval = false;
    },
    setProduct: (state, { payload }) => {
      state.product = payload;
      state.loading = false;
      state.error = null;
      state.reviewed = false;
    },
    setError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    setPagination: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.pagination = payload;
    },
    setFavorites: (state, { payload }) => {
      state.favorites = payload;
    },
    setFavoritesToggle: (state, { payload }) => {
      state.favoritesToggled = payload;
    },
    productReviewed: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.reviewed = payload;
    },
    resetError: (state) => {
      state.error = null;
      state.reviewed = false;
      state.productUpdate = false;
      state.productInsert = false;
      state.reviewRemoval = false;
    },
    setProductUpdateFlag: (state) => {
      state.productUpdate = true;
      state.loading = false;
    },
    setProductInsertFlag: (state) => {
      state.productInsert = true;
      state.loading = false;
    },
    setReviewRemovalFlag: (state) => {
      state.error = null;
      state.reviewRemoval = true;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  setProductsHome,
  setProducts,
  setProductsOveview,
  setPagination,
  setFavoritesToggle,
  setFavorites,
  setProduct,
  productReviewed,
  setProductUpdateFlag,
  setProductInsertFlag,
  resetError,
  setReviewRemovalFlag,
} = productsSlice.actions;

export default productsSlice.reducer;

export const productSelector = (state) => state.products;
