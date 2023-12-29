const { ErrorHandler } = require("../middleware/errorHandler");
const Product = require("../models/productModel.js");
// const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const cloudinary = require("cloudinary").v2;

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;
    console.log("Request Body:", req.body);

    console.log("Entire Request Object:", req);
    console.log("Request file:", req.file);

    owner = req.user._id;

    if (req.user.role !== "Seller") {
      next(new ErrorHandler(400, "Buyer cannot create a product"));
    }

    if (!name) {
      next(new ErrorHandler(400, "Name is required"));
    } else if (!description) {
      next(new ErrorHandler(400, "Description is required"));
    } else if (!price) {
      next(new ErrorHandler(400, "Price is required"));
    } else if (!stock) {
      next(new ErrorHandler(400, "Stock is required"));
    } else if (!category) {
      next(new ErrorHandler(400, "Category is required"));
    }

    let file = req.files ? req.files.file : null;
    let productImage = null;

    if (file) {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        public_id: `${Date.now()}`,
        resource_type: "auto",
        folder: "images",
      });

      if (result.resource_type == "image") {
        productImage = result.secure_url;
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      owner,
      productImage,
    });

    // console.log("product ", product);

    console.log(product);

    return res.status(201).json({
      success: true,
      msg: `Product added successfully`,
      product,
    });
  } catch (error) {
    console.log(error);
    next(error);
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
