const cloudinary = require("cloudinary").v2;
const { ErrorHandler } = require("../middleware/errorHandler");
const User = require("../models/userModel.js");

const editProfile = async (req, res, next) => {
  try {
    const userid = req.user._id;
    console.log(userid);
    if (!userid) {
      next(new ErrorHandler(400, "User id required"));
    }

    const user = await User.findById(userid);

    if (!user) {
      next(new ErrorHandler(400, "User not exists"));
    }

    let file = req.files ? req.files.file : null;

    console.log(file, "file");
    let photo = null;

    const { name, email, phone } = req.body;

    if (file) {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        public_id: `${Date.now()}`,
        resource_type: "auto",
        folder: "images",
      });

      if (result.resource_type == "image") {
        photo = result.secure_url;
      }
    }
    console.log(photo);
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.photo = photo;

    const updatedUser = await user.save();

    return res.status(201).json({
      success: true,
      msg: `Profile updated successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const showPackage = async (req, res, next) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId).populate("boughtPackages");

    if (!user) {
      next(new ErrorHandler(400, "User id required"));
    }

    const packages = user.boughtPackages;

    return res.status(200).json({
      success: true,
      msg: "package displayed",
      packages,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  editProfile,
  showPackage,
};
