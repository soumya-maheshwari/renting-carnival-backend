const Cart = require("../models/cartModel");
const { ErrorHandler } = require("../middleware/errorHandler");
const Product = require("../models/productModel");
const Package = require("../models/packageModel");

const addToCart = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user);
    const userId = user._id;

    console.log(user);
    if (!user) {
      return next(new ErrorHandler(400, "Login or signup to continue"));
    }

    const { productId } = req.body;

    if (!productId) {
      return next(new ErrorHandler(400, "select any product to continue"));
    }

    const product = await Product.findOne({
      _id: productId,
    });
    console.log(product);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found"));
    }

    console.log(product);
    console.log(product._id);

    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      populate: {
        path: "owner",
        select: "name",
      },
    });
    console.log("cart ", cart);

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    const cartItem = cart?.items.find(
      (item) => item.product && item.product.equals(product._id)
    );
    console.log("items ", cartItem);

    console.log(cartItem);

    if (cartItem) {
      await Cart.populate(cartItem, { path: "product" });
      // Product already in cart, increase quantity
      cartItem.quantity++;
    } else {
      // Product not in cart, add it to the cart items array
      cart.items.push({ product: product._id, quantity: 1 });
    }

    console.log(cartItem, "cartitem");

    if (user.boughtPackages.length > 0) {
      const userPackage = await Package.find({
        _id: { $in: user.boughtPackages },
      });
      const maxItemsAllowed = userPackage.numberOfProducts;
      const maxPriceLimit = userPackage?.price;

      console.log(maxItemsAllowed, "maxItemsAllowed");

      // Check if adding this product exceeds the maximum number of items allowed
      if (cart.items.length >= maxItemsAllowed) {
        return next(
          new ErrorHandler(400, "Exceeded maximum number of items allowed")
        );
      }

      // Calculate the total price in the cart
      const totalPriceInCart = cart.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

      const productPrice = product.price;

      if (totalPriceInCart + productPrice > maxPriceLimit) {
        return next(
          new ErrorHandler(400, "Adding this product exceeds price limit")
        );
      }
    }
    await cart.save();

    return res.status(200).json({
      success: true,
      cart,
      msg: "Product added to cart",
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// .populate("name", "description", "productImage", "price", "stock")

const removeFromCart = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;

    console.log(user);
    if (!user) {
      return next(new ErrorHandler(400, "Login or signup to continue"));
    }

    const { productId } = req.body;

    if (!productId) {
      return next(new ErrorHandler(400, "Select any product to continue"));
    }

    const product = await Product.findOne({
      _id: productId,
    });

    if (!product) {
      return next(new ErrorHandler(400, "Product not found"));
    }

    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      populate: {
        path: "owner",
        select: "name",
      },
    });

    if (!cart) {
      return next(new ErrorHandler(400, "Cart not found"));
    }

    // Find the index of the item in the cart
    const cartItemIndex = cart.items.findIndex((item) =>
      item.product.equals(product._id)
    );

    if (cartItemIndex !== -1) {
      const cartItem = cart.items[cartItemIndex];

      if (cartItem.quantity > 1) {
        // Decrease the quantity if greater than 1
        cartItem.quantity--;
      } else {
        // Remove the item from the cart if quantity is 1 or 0
        cart.items.splice(cartItemIndex, 1);
      }

      await cart.save();
    }

    return res.status(200).json({
      success: true,
      cart,
      msg: "Product removed from cart",
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;

    if (!user) {
      return next(new ErrorHandler(400, "Login or signup to continue"));
    }

    const cart = await Cart.findOne({
      user: userId,
    }).populate({
      path: "items.product",
      model: "Product",
      select: "name price owner category productImages",
    });
    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: [],
        total: 0,
        msg: "Cart is empty",
      });
    }
    console.log(cart);

    const detailedCartItems = [];

    let total = 0;

    cart.items.forEach((item) => {
      const product = item.product;
      const itemTotal = product.price * item.quantity;

      // Add the detailed item information to the array
      detailedCartItems.push({
        product: {
          _id: product._id,
          name: product.productName,
          price: product.price,
        },
        quantity: item.quantity,
        itemTotal: itemTotal,
      });

      total += itemTotal;
    });

    return res.status(200).json({
      success: true,
      cart: cart.items,
      total: total,
      cartId: cart._id,
      msg: "Products in the cart",
      detailedCartItems: detailedCartItems,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id;

    if (!user) {
      return next(new ErrorHandler(400, "Login or signup to continue"));
    }
    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      next(new ErrorHandler(400, "Cart not found"));
    }
    const { productId } = req.body;
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Product not found in the cart" });
    }

    // Remove the item from the items array
    cart.items.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();
    await cart.populate({
      path: "items.product",
      populate: {
        path: "owner",
        select: "name",
      },
    });

    return res.status(200).json({
      success: true,
      msg: "Product removed",
      cart,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    const cartId = req.params.cartId;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      next(new ErrorHandler(404, "Cart not found"));
    }

    await Cart.findByIdAndDelete(cartId);

    return res.status(200).json({
      success: true,
      msg: "Cart deleted",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getAllProducts,
  deleteProduct,
  deleteCart,
};
