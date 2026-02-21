// routes/reviewroute.js
const express = require("express");
const router = express.Router({ mergeParams: true }); // to get :id from parent route
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../views/schema");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedIn } = require("./middleware");
const reviewcontroller = require("../controller/review");
// Joi validation middleware
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) throw new ExpressError(400, error.details[0].message);
  next();
};

// POST /listings/:id/reviews  (only logged‑in)
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewcontroller.create)
);

// DELETE /listings/:id/reviews/:reviewId
router.delete(
  "/:reviewId",
  isLoggedIn,                                  // usually also check review owner later
  wrapAsync(reviewcontroller.destroy )
);

module.exports = router;
