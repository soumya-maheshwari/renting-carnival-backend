const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Cart = require("../models/cartModel");

const paymentMethod = async (req, res, next) => {
  const { products, customer } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.product.name,
      },
      unit_amount: Math.round(product.product.price * 100),
    },
    quantity: product.quantity,
  }));

  console.log("line items ", lineItems);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",

    shipping_address_collection: {
      allowed_countries: ["IN"],
    },
    success_url: "https://renting-carnival.netlify.app/success",
    cancel_url: "https://renting-carnival.netlify.app/failure",
  });

  const userId = req.user._id;

  let cart = await Cart.findOne({ user: userId });

  if (cart) {
    cart.items = [];
    await cart.save();

    console.log("cart deleted");
  }

  res.json({ id: session.id });
};

module.exports = {
  paymentMethod,
};
