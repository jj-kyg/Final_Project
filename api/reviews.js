const express = require("express");
const reviewsRouter = express.Router();
const { createReview, getReviewsByProduct, updateReview, deleteReview } = require("../db");

reviewsRouter.post("/", async (req, res, next) => {
  const {username, reviewId, rating, description} = req.body;
  try {
    const review = await createReview({username, reviewId, rating, description});
    if (review) {
      res.send(review) 
    } else {
      next({
        name: "Error",
        message: "Error creating review"
      })
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.patch("/:reviewId", async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await getReviewsByProduct(reviewId);

  try {
    const updatedReview = await updateReview(reviewId, review);
    res.send(updatedReview);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete('/:reviewId', async(req, res, next) => {
  try {
    const { reviewId } = req.params 
    const deletedReview = await deleteReview(reviewId);
    res.send(deletedReview);
  } catch (error) {
    next(error);
  }
});

module.exports = reviewsRouter;