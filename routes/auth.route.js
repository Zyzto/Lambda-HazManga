const router = require("express").Router();
const User = require("../models/user.model");
const flash = require('connect-flash')
const passport = require("../helper/ppConfig");
// const isLoggedIn = require("../helper/isLoggedin");
const {
  check,
  validationResult
} = require("express-validator");

router.get("/auth/register", (request, response) => {
  response.render("auth/register");
});

router.post(
  "/auth/register",
  [
    check("firstname").isLength({
      min: 2
    }),
    check("lastname").isLength({
      min: 2
    }),
    // username must be an email
    check("email").isEmail(),
    // password must be at least 5 chars long
    check("password").isLength({
      min: 6
    }).custom((value, {
      req,
      loc,
      path
    }) => {
      if (value !== req.body.confirmPassword) {
        // trow error if passwords do not match
        response.send(`Passwords don't match`);
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    })
  ],
  (request, response) => {
    const errors = validationResult(request);
    console.log(errors);
    if (!errors.isEmpty()) {
      request.flash("autherror", errors.errors);
      return response.redirect("/auth/register");
    }

    let user = new User(request.body);

    user
      .save()
      .then(() => {
        // user login after registration
        passport.authenticate("local", {
          successRedirect: "/home",
          successFlash: "Account created and You have logged In!"
        })(request, response);
        console.log(`here`);
      })
      .catch(err => {
        console.log(`ERROR: `, err);
        if (err.code == 11000) {
          request.flash("error", "Email Exists");
          return response.redirect("/home");
        }
        response.send(`error!!! ${err}`);
      });
  }
);

router.get("/auth/login", (request, response) => {
  response.render("auth/login");
});

router.post(
  "/auth/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/auth/login",
    failureFlash: "Invalid Username or Password",
    successFlash: "You have logged In!"
  })
);

router.get("/auth/logout", (request, response) => {
  request.logout(); //clear and break session
  request.flash("success", "Yay! your out!");
  response.redirect("/auth/login");
});

module.exports = router;