// Import necessary modules
import dotenv from "dotenv";
import connectToDatabase from "./db.js";
import express from "express";
import cors from "cors";
import path from "path";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import shippingRoutes from "./routes/shippingRoutes.js";
import stripeRoute from "./routes/stripeRoute.js";
// Load environment variables
dotenv.config();

// Initialize the database connection and Express app
connectToDatabase();
const app = express();

// CORS options
const corsOptions = {
  origin: "https://thuctapdoanhnghiep.netlify.app", // Specify your client URL here
  optionsSuccessStatus: 200, // For legacy browser support
};

// Enable CORS with options
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Define routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/checkout", stripeRoute);
app.use("/api/orders", orderRoutes);

app.get("/api/config/google", (req, res) =>
  res.send(process.env.GOOGLE_CLIENT_ID)
);

const port = process.env.PORT || 5000;

// Serve static images
const __dirname = path.resolve();
app.use("/images", express.static(path.join(__dirname, "/images")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

// Basic route for server testing
app.get("/", (req, res) => {
  res.send("Api is running...");
});

// Start the server
app.listen(port, () => {
  console.log(`Server runs on port ${port}`);
});
