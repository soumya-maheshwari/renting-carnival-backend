const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("../models/userModel");
const { ErrorHandler } = require("../middleware/errorHandler");
const { validatepassword, validatEmail } = require("../utils/validations");
const otpGenerator = require("otp-generator");
const mailer = require("../utils/mailer");
const Otp = require("../models/otpModel");

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_ACCESS_KEY, { expiresIn: "30d" });
};

const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    if (!(email && password)) {
      return next(new ErrorHandler(400, "email and password is required"));
    }

    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return next(new ErrorHandler(404, "user not found"));
    }

    const result = await bcrypt.compare(password, user.password);

    // console.log(password);
    // console.log(user.password);
    if (!result) return next(new ErrorHandler(400, "Invalid Credentials"));

    const accessToken = createAccessToken({ id: user._id });

    return res.status(200).json({
      id: user._id,
      success: true,
      msg: `WELCOME ${user.name} !! login successful`,
      user,
      accessToken,
    });
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

const signUpWithEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorHandler(400, "Email is required"));
    }

    if (!validatEmail(email)) {
      return next(new ErrorHandler(400, "Incorrect email format is provided"));
    }

    const isUserExists = await User.findOne({ email: email.toLowerCase() });

    if (isUserExists && isUserExists.isSignedUp) {
      return next(new ErrorHandler(400, "User with this email already exists"));
    }

    const OTPtoMail = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    mailer.sendEmail(email, OTPtoMail);

    const expiresat = Date.now() + 300000;

    const otpSent = await Otp.updateOne(
      { email },
      {
        $set: {
          otp: OTPtoMail.toString(),
          expiry: expiresat,
        },
      }
    );
    if (otpSent.modifiedCount == 0) {
      await Otp.create({
        email: email.toLowerCase(),
        otp: OTPtoMail,
        expiry: expiresat,
      });
    }

    return res.status(200).json({
      success: true,
      msg: `OTP has been sent to ${email}. Enter the OTP to complete the registration.`,
    });
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

const emailVerify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email) {
      return next(new ErrorHandler(400, "Email Required for otp verification"));
    }

    if (!otp) {
      return next(new ErrorHandler(400, "OTP Required for verification"));
    }

    const emailOtp = await Otp.findOne({ email: email.toLowerCase() });
    const prev_user = await User.findOne({ email: email.toLowerCase() });

    if (!emailOtp)
      return next(new ErrorHandler(400, "User not found by this email"));

    if (emailOtp.otp != otp)
      return next(new ErrorHandler(400, "Incorrect Otp"));

    if (emailOtp.expiry <= Date.now())
      return next(new ErrorHandler(400, "Otp expired"));

    console.log(emailOtp.expiry);
    console.log(Date.now());

    let user;
    if (!prev_user) {
      user = await User.create({
        email: email.toLowerCase(),
        isSignedUp: false,
      });
    } else {
      user = prev_user;
    }

    await Otp.deleteOne({ email: email.toLowerCase() });

    const token = createAccessToken({ id: user._id });

    return res.status(200).json({
      success: true,
      msg: "Otp verified",
      accessToken: token,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const signUpTwo = async (req, res, next) => {
  try {
    const { phone, name, password } = req.body;
    const user = req.user;

    const find_user = await User.findOne({ email: user.email.toLowerCase() });

    if (find_user && find_user.isSignedUp) {
      return next(new ErrorHandler(400, "User already exists"));
    }
    const pass = await bcrypt.hash(password, 12);
    const userr = await User.findOneAndUpdate(
      { email: user.email.toLowerCase() },
      {
        $set: {
          phone: phone,
          name: name,
          password: pass,
          isSignedUp: true,
        },
      }
    );

    console.log(userr);

    const accessToken = createAccessToken({ id: userr._id });

    return res.status(200).json({
      success: true,
      msg: `Welcome , ${name}, SignUp sucessful`,
      accessToken,
      userr,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

module.exports = {
  login,
  signUpWithEmail,
  emailVerify,
  signUpTwo,
};
