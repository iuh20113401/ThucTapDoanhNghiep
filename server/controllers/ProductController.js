import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { APIFeature } from "../utils/apiFeatures.js";
import Order from "../models/Order.js";

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
    salePrice,
    productIsSale,
    productIsNew,
    description,
    sizes,
    colors,
    slug,
  } = req.body;

  // Access uploaded files
  const coverImage = req.files?.coverImage?.[0]; // Access the first (and only) cover image
  const imageFiles = req.files?.images || []; // Access additional images

  // Check for missing fields
  if (!coverImage) {
    return res.status(400).send({ message: "Cover image is required." });
  }

  // Create product object
  const newProduct = await Product.create({
    brand,
    name,
    category,
    stock,
    price,
    salePrice,
    productIsNew,
    productIsSaleOff: productIsSale,
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
  const { id } = req.params;
  const {
    brand,
    name,
    category,
    stock,
    price,
    salePrice,
    productIsSale,
    productIsNew,
    description,
    sizes,
    colors,
    slug,
  } = req.body;

  const coverImage = req.files?.coverImage?.[0];
  const imageFiles = req.files?.images || [];

  // Build the update object dynamically
  const updateFields = {};

  if (brand) updateFields.brand = brand;
  if (name) updateFields.name = name;
  if (category) updateFields.category = category;
  if (stock) updateFields.stock = stock;
  if (price) updateFields.price = price;
  if (salePrice) updateFields.salePrice = salePrice;
  if (typeof productIsSale !== "undefined")
    updateFields.productIsSaleOff = productIsSale;
  if (typeof productIsNew !== "undefined")
    updateFields.productIsNew = productIsNew;
  if (description) updateFields.description = description;
  if (sizes) updateFields.sizes = sizes;
  if (colors) updateFields.colors = colors;
  if (slug) updateFields.slug = slug;

  // If coverImage is uploaded, update the cover image
  if (coverImage) {
    updateFields.coverImage = `/images/${coverImage.filename}`;
  }

  // If images are uploaded, map the filenames to paths
  if (imageFiles.length > 0) {
    updateFields.images = imageFiles.map((file) => `/images/${file.filename}`);
  }

  // Find and update the product in a single query
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    res.status(404).send("Product not found.");
    throw new Error("Product not found.");
  }

  res.json(updatedProduct);
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
export const getOverview = async (req, res) => {
  try {
    const overviewData = await Product.aggregate([
      {
        $project: {
          colors: 1,
          sizes: 1,
          brand: 1,
          rating: 1,
          effectivePrice: { $min: ["$price", "$salePrice"] },
        },
      },
      { $unwind: { path: "$colors", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$sizes", preserveNullAndEmptyArrays: true } },

      {
        $group: {
          _id: null,
          distinctColors: { $addToSet: "$colors.ten" },
          distinctSizes: { $addToSet: "$sizes" },
          distinctBrands: { $addToSet: "$brand" },
          distinctRatings: { $addToSet: "$rating" },
          minPrice: { $min: "$effectivePrice" }, // Use the effective price for min
          maxPrice: { $max: "$effectivePrice" }, // Use the effective price for max
        },
      },
      {
        $set: {
          distinctColors: {
            $filter: {
              input: "$distinctColors",
              as: "color",
              cond: { $ne: ["$$color", null] },
            },
          },
          distinctSizes: {
            $filter: {
              input: "$distinctSizes",
              as: "size",
              cond: { $ne: ["$$size", null] },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          distinctColors: 1,
          distinctSizes: 1,
          distinctBrands: 1,
          distinctRatings: 1,
          minPrice: 1,
          maxPrice: 1,
        },
      },
    ]);

    res.status(200).json({ data: overviewData[0] });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving overview data", error });
  }
};

const getDistinctCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json({
      status: "success",
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error("Error fetching distinct categories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getDistinctBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    res.status(200).json({
      status: "success",
      data: {
        brands,
      },
    });
  } catch (error) {
    console.error("Error fetching distinct brands:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getMostSaleOffProducts = async () => {
  try {
    const products = await Product.aggregate([
      {
        $addFields: {
          discountPercentage: {
            $multiply: [
              {
                $divide: [
                  { $subtract: ["$salePrice", "$price"] },
                  "$salePrice",
                ],
              },
              100,
            ],
          },
        },
      },
      { $match: { productIsSaleOff: true } },
      { $sort: { discountPercentage: -1 } }, // Sort by highest discount
      { $limit: 6 }, // Limit to 6 products
    ]);

    // If less than 6 sale-off products are found, query additional products
    if (products.length < 6) {
      const additionalProducts = await Product.find()
        .sort({ price: 1 }) // Sort by newest first
        .limit(6 - products.length); // Limit to fill the gap
      return [...products, ...additionalProducts]; // Combine both arrays
    }

    return products;
  } catch (error) {
    console.error("Error getting most sale off products:", error);
    return [];
  }
};

const getMostSoldProducts = async () => {
  try {
    const products = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.id",
          totalSold: { $sum: "$orderItems.qty" },
        },
      },
      { $sort: { totalSold: -1 } }, // Sort by most sold
      { $limit: 6 }, // Limit to 6 products
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: "$productDetails._id",
          name: "$productDetails.name",
          price: "$productDetails.price",
          totalSold: 1,
          coverImage: "$productDetails.coverImage",
        },
      },
    ]);

    // If less than 6 sold products are found, query additional products
    if (products.length < 6) {
      const additionalProducts = await Product.find()
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(6 - products.length); // Limit to fill the gap
      return [...products, ...additionalProducts]; // Combine both arrays
    }

    return products;
  } catch (error) {
    console.error("Error getting most sold products:", error);
    return [];
  }
};

// Route handler for `getProductsHome`
// Enhanced getProductsHome function
export const getProductsHome = async (req, res) => {
  try {
    // Execute all async operations in parallel using Promise.all
    const [
      mostSaleOffProducts,
      mostSoldProducts,
      distinctBrands,
      distinctCategories,
    ] = await Promise.all([
      getMostSaleOffProducts(),
      getMostSoldProducts(),
      Product.distinct("brand"),
      Product.distinct("category"),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        mostSaleOffProducts,
        mostSoldProducts,
        brands: distinctBrands,
        categories: distinctCategories,
      },
    });
  } catch (error) {
    console.error("Error fetching home products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
