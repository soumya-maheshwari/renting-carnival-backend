const { ErrorHandler } = require("../middleware/errorHandler.js");
const Review = require("../models/reviewModel.js");

const createReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;

    const name = req.user.name;

    if (!name || !rating || !comment || !productId) {
      throw new ErrorHandler(400, "All the input fields are required.");
    }

    const review = new Review({ name, rating, comment, productId });
    await review.save();

    return res.status(200).json({
      success: true,
      msg: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ErrorHandler(500, "Error occured while creating review"));
  }
};

const getProductReview = async (req, res, next) => {
  try {
    const productId = req.params.id;
    
    const reviews = await Review.find({ productId });

    return res.status(200).json({
      success: true,
      reviews,
      msg: "Reviews displayed.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({});

    return res.status(200).json({
      success: true,
      reviews,
      msg: "All reviews displayed.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    if (!reviewId) {
      throw new ErrorHandler(400, "No review available for this id");
    }

    await Review.findByIdAndDelete(reviewId);
    return res.status(200).json({
      success: true,
      msg: "Review deleted successfully",
      reviewId,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  createReview,
  getAllReviews,
  deleteReview,
  getProductReview,
};
