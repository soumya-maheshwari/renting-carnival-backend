const Package = require("../models/packageModel");

const getAllPackages = async (req, res, next) => {
  try {
    const packages = await Package.find();
    return res.satus(200).json({
      success: true,
      msg: "All packages",
      packages,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getAllPackages,
};
