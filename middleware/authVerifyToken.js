const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { ErrorHandler } = require("./errorHandler");
require("dotenv").config();

const authVerifyToken = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log(token);
      const verify = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      console.log(verify);
      req.user = await User.findById(verify.id).select("-password");
      console.log(req.user);
      next();
    } catch (error) {
      console.log(error);
      next(new ErrorHandler(401, "not authorized , token failed"));
    }
  }
  if (!token) {
    next(new ErrorHandler(401, "no token"));
  }
};

module.exports = {
  authVerifyToken,
};
