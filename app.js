// app.js

const express = require("express");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");

const Listing = require("./models/listing");
const User = require("./models/user");

const listingRoutes = require("./routes/listingroute");
const reviewRoutes = require("./routes/reviewroute");
const userRoutes = require("./routes/userroute");

const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");

// ====== DATABASE ======
const dburl = process.env.mongo_url;

// connect to MongoDB (Atlas)
mongoose
  .connect(dburl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ====== BASIC SETUP ======
const port = process.env.PORT || 3000;

// view engine + layouts
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ====== SESSION STORE (Mongo) ======
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.secreat,
  },
  touchAfter: 24 * 3600, // seconds
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

// ====== SESSION + FLASH ======
const sessionOptions = {
  store,
  secret: process.env.secreat,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ====== PASSPORT SETUP ======
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// demo route to create a fake user
app.get("/demoUser", async (req, res) => {
  const fakeUser = new User({
    email: "student@gmail.com",
    username: "om",
  });
  const registeredUser = await User.register(fakeUser, "hello");
  res.send(registeredUser);
});

// make flash messages + user available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ====== ROUTES ======

// listings routes mounted at /listings
app.use("/listings", listingRoutes);

// review routes mounted under a listing
app.use("/listings/:id/reviews", reviewRoutes);

// user auth routes (login, register, etc.)
app.use("/", userRoutes);

// TEST route (optional, can remove later)
app.get(
  "/testlisting",
  wrapAsync(async (req, res) => {
    const sample = new Listing({
      title: "my new home",
      description: "800 yard",
      price: 1200,
      location: "raipur",
      country: "india",
      image: { url: "" },
      owner: req.user ? req.user._id : undefined,
      geometry: { type: "Point", coordinates: [77.209, 28.6139] },
    });
    await sample.save();
    res.json(sample);
  })
);

// ROOT
app.get("/", (req, res) => res.redirect("/listings"));

// 404 handler (keep last before error handler)
app.use((req, res, next) => {
  console.log("No route matched:", req.method, req.originalUrl);
  next(new ExpressError(404, "page not found"));
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500 } = err;
  const message = err.message || "something is wrong";
  res.status(statusCode).render("error.ejs", { message });
});

// START SERVER
app.listen(port, () => console.log(`server is listening to ${port}`));
