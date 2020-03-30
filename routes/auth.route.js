const router = require("express").Router();
const User = require("../models/user.model");
const flash=require('connect-flash')
// const passport = require("../helper/ppConfig");
// const isLoggedIn = require("../helper/isLoggedin");
const { check, validationResult } = require("express-validator");

router.get("/auth/register", (request, response) => {
  response.render("auth/register");
});

router.post(
  "/auth/register",
  [
    check("firstname").isLength({ min: 2 }),
    check("lastname").isLength({ min: 2 }),
    // username must be an email
    check("email").isEmail(),
    // password must be at least 5 chars long
    check("password").isLength({ min: 8 }),
    // check("password Confirmation").isLength({ min: 8 })
    
  ],
  (request, response) => {
    const errors = validationResult(request);
    console.log(errors);
    if (!errors.isEmpty()) {
    //   request.flash("autherror", errors.errors);
      return response.redirect("/auth/register");
    }

    let user = new User(request.body);

    user
      .save()
      .then(() => {
        //user login after registration
        passport.authenticate("local", {
          successRedirect: "/home",
          successFlash: "Account created and You have logged In!"
        })(request, response);
      })
      .catch(err => {
        // console.log(err);
        if (err.code == 11000) {
          console.log("Email Exists");
        //   request.flash("error", "Email Exists");
          return response.redirect("/auth/register");
        }
        response.send("error!!!");
      });
  }
);
module.exports = router ;