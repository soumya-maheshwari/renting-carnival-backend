const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (email, otp) => {
  try {
    const msg = {
      from: "soumyamaheshwari2003@gmail.com",
      to: email,
      subject: "Welcome to Renting Carnival - Email Verification",
      html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #CDA274; text-align: center; color: #fff;">
            <h1 style="color: #fff;">Welcome to Renting Carnival!</h1>
            <p style="font-size: 16px;">To verify your email, please use the following OTP:</p>
            <h1 style="color: #007bff;">${otp}</h1>
            <p style="font-size: 14px;">This OTP is valid for a short period, so please use it promptly.</p>
          </div>
        `,
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      // secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    transporter.sendMail(msg, (err) => {
      if (err) {
        console.log(err);
        return false;
      } else {
        console.log("Mail sent successfully");
        return true;
      }
    });
  } catch (error) {
    // return next(error);
    console.log(error);
  }
};

module.exports = { sendEmail };
