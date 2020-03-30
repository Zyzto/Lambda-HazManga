const router = require("express").Router();
const User = require("../models/user.model");
const flash = require('connect-flash')
const { check, validationResult } = require("express-validator");

router.get("/home", (request, response) => {
    // request.user
    User.find().then(users => {
        response.render("home", { users });
    });
});

router.get("/item", (request, response) => {
    response.render("item");
   });

module.exports = router;