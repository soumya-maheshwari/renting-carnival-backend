const Package = require("../models/packageModel");
const User = require("../models/userModel.js");

const getAllPackages = async (req, res, next) => {
  try {
    const packages = await Package.find();
    return res.status(200).json({
      success: true,
      msg: "All packages",
      packages,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getSinglePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    console.log("package id ", packageId);
    // Find the package by ID in the database
    const package = await Package.findById(packageId);

    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }

    return res.status(200).json({ package });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updatePackage = async (req, res, next) => {
  try {
    const userid = req.user._id;
    const user = await User.findById(userid);
    if (!user) {
      next(new ErrorHandler(400, "User not exists"));
    }

    const { packageId } = req.body;

    const package = await Package.findById(packageId);
    if (!package) {
      next(new ErrorHandler(400, "package not exists"));
    }

    user.boughtPackages.push(package.packageId);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Package updated successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getAllPackages,
  getSinglePackage,
  updatePackage,
};
