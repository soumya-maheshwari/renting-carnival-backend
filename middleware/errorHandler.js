class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = {
  errorMiddleware: (err, req, res, next) => {
    err.message = err.message || "Interal Server Error";
    err.statusCode = err.statusCode || 500;
    console.log(err);
    console.log(err.message);

    return res.status(err.statusCode).json({
      success: false,
      msg: err.message,
      statusCode: err.statusCode,
    });
  },
  ErrorHandler,
};
