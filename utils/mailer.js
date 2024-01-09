const nodemailer = require("nodemailer");
require("dotenv").config();

const emailUser = "vivek.thakur.ug20@nsut.ac.in";
const emailPassword = "Vivekthakur!@#123";

const sendEmail = async (email, otp) => {
  try {
    // console.log(process.env.USER);
    const msg = {
      from: process.env.USER,
      // from: emailUser,

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
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,

      // service: "gmail",
      // port: 587,

      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
        // user: emailUser,

        // pass: emailPassword,
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
