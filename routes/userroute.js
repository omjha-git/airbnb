const express = require("express");
const router = express.Router();
const passport = require("passport");
const usercontroller = require("../controller/user");
const { saveRedirectUrl } = require("./middleware");

// /signup
router
  .route("/signup")
  .get(usercontroller.showsignup)
  .post(usercontroller.signup);

// /login
router
  .route("/login")
  .get(usercontroller.showlogout)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usercontroller.handlelogout
  );

// logout
router.get("/logout", usercontroller.login);

module.exports = router;
