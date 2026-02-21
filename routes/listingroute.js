const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../views/schema");
const Listing = require("../MODEL/LISTING");
const listingcontroller = require("../controller/listing");
const { isLoggedIn, isOwner } = require("./middleware");
const multer = require("multer");
const { storage } = require("../cloudconfiguration");
const upload = multer({ storage });

// Joi validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) throw new ExpressError(400, error.details[0].message);
  next();
};

// INDEX + CREATE  ->  /listings  and POST /listings
router
  .route("/")
  .get(wrapAsync(listingcontroller.index))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(listingcontroller.create)
  );

// NEW ->  /listings/new
router.get("/new", isLoggedIn, listingcontroller.rendernewform);

// map URL part -> category value in DB
const CATEGORY_MAP = {
  trending: "Trending",
  rooms: "Rooms",
  mountain: "Mountain",
  beach: "Beach",
  forest: "Forest",
  lake: "Lake",
  city: "City",
  snow: "Snow",
  camping: "Camping",
  farm: "Farm",
  boats: "Boats",
  homes: "Homes",
  luxury: "Luxury",
  village: "Village"
};

// CATEGORY PAGE: /listings/category/:slug
router.get("/category/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;      // e.g. "mountain"
    const cat = CATEGORY_MAP[slug];

    if (!cat) {
      return res.status(404).render("error", { message: "Category not found" });
    }

    const allListings = await Listing.find({ category: cat });
    res.render("listings/category", { allListings, categoryName: cat, slug });
  } catch (e) {
    next(e);
  }
});

// SHOW + UPDATE + DELETE ->  /listings/:id
router
  .route("/:id")
  .get(wrapAsync(listingcontroller.get))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingcontroller.update)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingcontroller.deleteListing)
  );

// EDIT ->  /listings/:id/edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found");
    res.render("listings/edit", { listing });
  })
);

module.exports = router;
