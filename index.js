const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./connectDB");
const app = express();

const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 5000;

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const productRoutes = require("./routes/productRoutes");
const commentRoutes = require("./routes/commentRoute");
const reviewRoutes = require("./routes/reviewRoute");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const { errorMiddleware } = require("./middleware/errorHandler");

app.use(express.json());
app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: false }));

app.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(errorMiddleware);

// Connection to DataBase
connectDB();

// routes
app.use("/auth", authRoutes, errorMiddleware);
app.use("/contact", contactRoutes, errorMiddleware);
app.use("/product", productRoutes, errorMiddleware);
app.use("/comment", commentRoutes, errorMiddleware);
app.use("/review", reviewRoutes, errorMiddleware);
app.use("/cart", cartRoutes, errorMiddleware);
app.use("/wishlist", wishlistRoutes, errorMiddleware);
