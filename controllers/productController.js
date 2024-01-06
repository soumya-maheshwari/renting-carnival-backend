const { ErrorHandler } = require("../middleware/errorHandler");
const Product = require("../models/productModel.js");
// const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const cloudinary = require("cloudinary").v2;

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;
    // console.log("Request Body:", req.body);

    // console.log("Entire Request Object:", req);
    // console.log("Request file:", req.file);
    // console.log("request files ", req.files.productImages);

    //     console.log(req.user);
    owner = req.user._id;

    if (req.user.role === "buyer") {
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

    let files = req.files ? req.files.productImages : null;
    console.log("files ", files);
    let productImages = [];

    if (files) {
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          public_id: `${Date.now()}`,
          resource_type: "auto",
          folder: "images",
        });

        console.log("result ", result);

        if (result && result.secure_url) {
          productImages.push(result.secure_url);
        } else {
          return res
            .status(500)
            .json({ message: "Failed to upload one or more images" });
        }
      }
    }

    console.log("product images ", productImages);

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      owner,
      productImages,
    });

    console.log("product ", product);

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
    const products = await Product.find({}).populate("owner", "name");
    res.status(200).json({
      success: true,
      msg: "All products retrieved successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getUserProducts = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch products belonging to the specified user
    const userProducts = await Product.find({ owner: userId });

    return res.status(200).json({
      success: true,
      msg: "User's products retrieved successfully",
      userProducts,
    });
  } catch (error) {
    console.log(error);
    next(error);
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

const getSingleProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      next(new ErrorHandler(400, "Product not found"));
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return err.response;
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getUserProducts,
  deleteProduct,
  getSingleProduct,
};
