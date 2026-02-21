const User = require("../MODEL/user");

// show signup form
module.exports.showsignup = (req, res) => {
  res.render("users/signup");
};

// handle signup
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "welcome to wanderlust");
      return res.redirect("/listings");
    });
  } catch (err) {
    next(err);
  }
};

// show login form
module.exports.showlogout = (req, res) => {
  res.render("users/login");
};

// handle login success (after passport.authenticate)
module.exports.handlelogout = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// logout route
module.exports.login = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
};
