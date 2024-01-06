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

    // Get the packageId from the session metadata
    const packageId = session.metadata.packageId;

    // Update your package or perform actions related to successful payment
    try {
        console.log("inside update package");
    //   await updatePackage(packageId); 
      // Call your function to update the package
      // Example:
      // await Package.findByIdAndUpdate(packageId, { ... }); // Update the package in the database
    } catch (error) {
      console.error("Error updating package:", error);
      // Handle error updating package
    }
  }

  res.json({ received: true });
};

module.exports = {handleStripeWebhook}
