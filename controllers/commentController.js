const { ErrorHandler } = require("../middleware/errorHandler");
const Comment = require("../models/commentModel");

const createComment = async (req, res, next) => {
  try {
    const { name, email, comment } = req.body;

    if (!name || !email || !comment) {
      throw new ErrorHandler(400, "Field cannot be empty");
    }

    const newComment = new Comment({ name, email, comment });

    await newComment.save();

    return res.status(200).json({
      success: true,
      msg: "Review submitted successfully",
      newComment,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ErrorHandler(500, "Error occured while creating review"));
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({});

    return res.status(200).json({
      success: true,
      comments,
      msg: "All comments are displayed.",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    if (!reviewId) {
      throw new ErrorHandler(400, "No review available for this id");
    }

    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({
      success: true,
      msg: "Review deleted successfully",
      commentId,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  createComment,
  getAllComments,
  deleteComment,
};
