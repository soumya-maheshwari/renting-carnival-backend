const { ErrorHandler } = require("../middleware/errorHandler");
const Product = require("../models/productModel.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;
    owner = req.user._id;

    // Validation - ensure required fields are present
    if (!name || !description || !price || !stock || !category || !owner) {
      throw new ErrorHandler(400, "All required fields must be provided");
    }

    // console.log("request  ", req);

    // Check for product images uploaded via multer
    const productImages = req.files;
    // console.log(productImages);
    if (!productImages || productImages.length === 0) {
      throw new ErrorHandler(400, "Product images are required");
    }

    // Perform the upload to Cloudinary for each product image
    const uploadedImages = await Promise.all(
      productImages.map(async (image) => {
        const imageUrl = await uploadOnCloudinary(image.path);
        return imageUrl?.url || null;
      })
    );

    // console.log("uploaded images ", uploadedImages);
    // Create the product in the database with the uploaded image URLs
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      owner,
      productImage: uploadedImages,
    });

    // console.log("product ", product);

    if (!product) {
      throw new ErrorHandler(500, "Error while creating the product");
    }

    return res.status(201).json({
      success: true,
      msg: `Product added successfully`,
      product,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json(
        new ErrorHandler(400, error.message || "Error while creating product")
      );
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      msg: "All products retrieved successfully",
      products,
    });
  } catch (error) {
    res
      .status(500)
      .json(new ErrorHandler(500, "Error while fetching products"));
  }
};

const getUserProducts = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch products belonging to the specified user
    const userProducts = await Product.find({ owner: userId });

    res.status(200).json({
      success: true,
      msg: "User's products retrieved successfully",
      userProducts,
    });
  } catch (error) {
    res
      .status(500)
      .json(new ErrorHandler(500, "Error while fetching user's products"));
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new ErrorHandler(404, "Product not found");
    }

    console.log(product);
    // Delete the product
    await Product.findByIdAndDelete(productId);

    res.status(200).json({
        success: true,
        msg: "Product deleted successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json(new ErrorHandler(500, "Error while deleting product"));
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getUserProducts,
  deleteProduct,
};
