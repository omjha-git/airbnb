
const Listing = require("../MODEL/LISTING");
const Review = require("../MODEL/review"); // make sure this line exists

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // store original URL in session
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  // if we previously saved a redirect URL, expose it to views/handlers
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    // delete req.session.redirectUrl; // optional
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  // listing not found
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // owner missing or user not logged in
  if (!req.user || !listing.owner || !listing.owner.equals(req.user._id)) {
    req.flash("error", "you don't have premission!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  // find the review, not the listing
  const review = await Review.findById(reviewId); // make sure Review is required above

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  // check review.author instead of listing.owner
  if (!req.user || !review.author || !review.author.equals(req.user._id)) {
    req.flash("error", "you don't have permission!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
