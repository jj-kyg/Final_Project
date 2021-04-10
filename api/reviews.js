const express = require("express");
const reviewsRouter = express.Router();
const { createReview, updateReview, deleteReview } = require("../db");
const { requireCustomer } = require('./utils');

reviewsRouter.post("/", requireCustomer, async (req, res, next) => {
  console.log(req.body)
  const {username, reviewId, rating, description} = req.body;
  
  try {
    const review = await createReview({username, reviewId, rating, description});
    if (review) {
      console.log(review)
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

reviewsRouter.patch("/:reviewId", requireCustomer, async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    const updatedReview = await updateReview(reviewId, req.body);
    res.send(updatedReview);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete('/:reviewId', requireCustomer, async(req, res, next) => {
  const { reviewId } = req.params;
  try {
    const deletedReview = await deleteReview(reviewId);
    res.send(deletedReview);
  } catch (error) {
    next(error);
  }
});

module.exports = reviewsRouter;