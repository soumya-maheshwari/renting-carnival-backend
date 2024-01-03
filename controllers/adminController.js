const { ErrorHandler } = require("../middleware/errorHandler");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const cloudinary = require("cloudinary").v2;

const allUsers = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== "Admin") {
      next(new ErrorHandler(400, "You are not an admin"));
    }
    const users = await User.find();
    res.status(200).json({
      success: true,
      msg: "All users",
      users,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const allProducts = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== "Admin") {
      next(new ErrorHandler(400, "You are not an admin"));
    }
    const products = await Product.find().populate("owner", "name");
    res.status(200).json({
      success: true,
      msg: "All products",
      products,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== "Admin") {
      next(new ErrorHandler(400, "You are not an admin"));
    }

    const { name, description, price, stock, category } = req.body;
    console.log("Request Body:", req.body);

    console.log("Entire Request Object:", req);
    console.log("Request file:", req.file);

    //     console.log(req.user);
    owner = req.user._id;

    if (req.user.role === "Buyer") {
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

const editProduct = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== "Admin") {
      next(new ErrorHandler(400, "You are not an admin"));
    }

    const productId = req.params.productId;
    const { name, description, price, stock, category } = req.body;

    if (!name && !description && !price && !stock && !category) {
      return next(
        new ErrorHandler(400, "At least one field is required for editing")
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler(404, "Product not found"));
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();

    res.status(200).json({
      success: true,
      msg: `Product with ID ${productId} updated successfully`,
      product,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== "Admin") {
      next(new ErrorHandler(400, "You are not an admin"));
    }

    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler(404, "Product not found"));
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      msg: `Product with ID ${productId} deleted successfully`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = {
  allUsers,
  allProducts,
  addProduct,
  editProduct,
  deleteProduct,
};
