const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Package = require("../models/packageModel");
const User = require("../models/userModel");

const handleStripeWebhook = async (req, res, next) => {
  console.log("handle stripe webhook called ");
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      "whsec_OTZZVRTAmLbZHiwGrNTVgwHgGeKPrwxF"
    );
  } catch (err) {
    console.error(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Check for the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    console.log("inside completed section ");
    const session = event.data.object;

    console.log(session.metadata, "seesion metadata");
    // Retrieve the packageId from the session metadata
    const packageId = session.metadata.packageId;

    // Now 'packageId' contains the ID of the package associated with this Stripe Checkout Session
    console.log("Received packageId:", packageId);

    // Get the packageId from the session metadata
    const userId = session.metadata.userId;

    // Update your package or perform actions related to successful payment
    try {
      console.log("inside update package");
      //   await updatePackage(packageId);
      // Call your function to update the package
      // Example:
      // await Package.findByIdAndUpdate(packageId, { ... }); // Update the package in the database

      try {
        const user = await User.findById(userId);

        const package = await Package.findById(packageId);
        if (!package) {
          next(new ErrorHandler(400, "package not exists"));
        }

        user.boughtPackages.push(package.packageId);
        console.log(user);
        await user.save();
      } catch (error) {}
    } catch (error) {
      console.error("Error updating package:", error);
      // Handle error updating package
    }
  }

  res.json({ received: true });
};

module.exports = { handleStripeWebhook };
