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
          return response.redirect("/auth/register");
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


//-- change password 
router.post ("/auth/change",(request, response)=>{
  if (request.body.password ==request.body.confirmPassword){
    let newPass= request.body.password;
    let  hashedPass = bcrypt.hashSync(newPass,10);
    User.findByIdAndUpdate(request.user._id,{password:hashedPass},(err,updatedMoodel)=>{
      request.flash("success", "Password updated Successfully");
      response.redirect("/home ");
      
    });
  }
  else{
    request.flash("success","password and confirm password do not match ")
    response.redirect('/auth/change')
  }
});
module.exports = router;