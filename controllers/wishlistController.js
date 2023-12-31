const { ErrorHandler } = require("../middleware/errorHandler");
const Product = require("../models/productModel");
const Wishlist = require("../models/wishlistModel");

const addToWishlist = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;

    if (!user) {
      return next(new ErrorHandler(400, "Login or signup to continue"));
    }
    const { productId } = req.body;

    if (!productId) {
      next(new ErrorHandler(400, "ProductID required"));
    }

    const product = await Product.findOne({
      _id: productId,
    });
    console.log(product);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found"));
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }
    console.log(wishlist);

    if (wishlist.products.includes(productId)) {
      next(new ErrorHandler(400, "Product already in wishlist"));
    } else {
      wishlist.products.push(productId);
    }
    await wishlist.save();

    return res.json({
      success: true,
      msg: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getWishlist = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;

    if (!user) {
      return next(new ErrorHandler(400, "Login or signup to continue"));
    }

    const wishlist = await Wishlist.findOne({
      user: userId,
    }).populate("products");
    if (!wishlist) {
      next(new ErrorHandler(400, "Wishlist do not exists"));
    }

    return res.status(200).json({
      success: true,
      wishlist,
      msg: "Wishlist items dispalyed",
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;

    if (!user) {
      return next(new ErrorHandler(400, "Login or signup to continue"));
    }

    const { productId } = req.body;

    if (!productId) {
      next(new ErrorHandler(400, "ProductID required"));
    }

    const product = await Product.findOne({
      _id: productId,
    });

    if (!product) {
      return next(new ErrorHandler(400, "Product not found"));
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      return next(new ErrorHandler(400, "Product not in wishlist"));
    } else {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId.toString()
      );
    }

    await wishlist.save();

    await wishlist.populate("products");

    return res.json({
      success: true,
      msg: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
