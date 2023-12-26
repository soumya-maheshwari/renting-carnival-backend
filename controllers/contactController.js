const { ErrorHandler } = require("../middleware/errorHandler");
const ContactUs = require("../models/contactModel");

const contactUs = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return new ErrorHandler(400, "All Fields are required");
    }

    const contactMessage = new ContactUs({ name, email, message });
    const savedContact = await contactMessage.save();
    res.status(200).json({
      success: true,
      msg: "Message sent",
      contactMessage,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  contactUs,
};
