import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { APIFeature } from "../utils/apiFeatures.js";

export const getProducts = async (req, res) => {
  const page = parseInt(req.params.page); // 1, 2 or 3
  const perPage = parseInt(req.params.perPage); // 10
  const feature = new APIFeature(Product.find(), req.query).filter().sort();
  let { query } = feature;

  const products = await query;

  if (page && perPage) {
    const totalPages = Math.ceil(products.length / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    res.json({
      products: paginatedProducts,
      pagination: { currentPage: page, totalPages },
    });
  } else {
    res.json({ products, pagination: {} });
  }
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).send("Product not found.");
    throw new Error("Product not found");
  }
};

export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, userId, title } = req.body;

  const product = await Product.findById(req.params.id);
  const user = await User.findById(userId);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400).send("Product already reviewed.");
      throw new Error("Product already reviewed.");
    }

    const review = {
      name: user.name,
      rating: Number(rating),
      comment,
      title,
      user: user._id,
    };

    product.reviews.push(review);

    product.numberOfReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review has been saved." });
  } else {
    res.status(404).send("Product not found.");
    throw new Error("Product not found.");
  }
});
export const createNewProduct = asyncHandler(async (req, res) => {
  const {
    brand,
    name,
    category,
    stock,
    price,
    productIsNew,
    description,
    sizes,
    colors,
    slug,
  } = req.body;

  // Access uploaded files
  const coverImage = req.files?.coverImage?.[0]; // Access the first (and only) cover image
  const imageFiles = req.files?.images || []; // Access additional images

  // Log uploaded files to check
  console.log("Cover Image:", coverImage);
  console.log("Additional Images:", imageFiles);

  // Check for missing fields
  if (!coverImage) {
    return res.status(400).send("Cover image is required.");
  }

  // Create product object
  const newProduct = await Product.create({
    brand,
    name,
    category,
    stock,
    price,
    productIsNew,
    description,
    sizes,
    colors,
    slug,
    coverImage: coverImage ? `/images/${coverImage.filename}` : null, // Save cover image path
    images:
      imageFiles.length > 0
        ? imageFiles.map((file) => `/images/${file.filename}`)
        : [], // Save additional images paths
  });

  await newProduct.save();

  if (newProduct) {
    res.json(newProduct); // Return the new product details
  } else {
    res.status(400).send("Product could not be uploaded.");
    throw new Error("Product could not be uploaded.");
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const {
    id,
    brand,
    name,
    category,
    stock,
    price,
    productIsNew,
    description,
    sizes,
    colors,
  } = req.body;
  const coverImage = req.file; // Single cover image
  const imageFiles = req.files; // Additional images

  const product = await Product.findById(id);

  if (product) {
    product.brand = brand;
    product.name = name;
    product.category = category;
    product.stock = stock;
    product.price = price;
    product.productIsNew = productIsNew;
    product.description = description;
    product.sizes = sizes;
    product.colors = colors;

    if (coverImage) {
      product.coverImage = `/images/${coverImage.filename}`; // Update cover
    }

    if (imageFiles) {
      product.images = imageFiles.map((file) => `/images/${file.filename}`); // Update additional images
    }

    await product.save();
    res.json(product);
  } else {
    res.status(404).send("Product not found.");
    throw new Error("Product not found.");
  }
});

export const removeProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  const updatedReviews = product.reviews.filter(
    (review) => review._id.valueOf() !== req.params.reviewId
  );

  if (product) {
    product.reviews = updatedReviews;

    product.numberOfReviews = product.reviews.length;

    if (product.numberOfReviews > 0) {
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating = 5;
    }

    await product.save();
    const products = await Product.find({});
    res.json({ products, pagination: {} });
  } else {
    res.status(404).send("Product not found.");
    throw new Error("Product not found.");
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).send("Product not found.");
    throw new Error("Product not found.");
  }
});
