const router = require("express").Router();
const User = require("../models/user.model");
const Item = require("../models/item.model");
const flash = require('connect-flash')
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        let fileExtension = path.extname(file.originalname).split(".")[1];
        cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension);
    }
});
let upload = multer({ storage: storage });

router.get("/home", (request, response) => {
    // request.user
    User.find().then(users => {
        Item.find().then(item => {
            response.render("home", { item, users });
        })
            .catch(err => {
                request.flash("error", err)
            })
    });
});

router.get("/item", (request, response) => {
    Item.find().then(item => {
        response.render("item", { item });
    })
        .catch(err => {
            request.flash("error", err)
        })
});

router.get("/item/create", (request, response) => {
    response.render("createItem");
});


router.post("/item/create", upload.single("filetoupload"), (req, res, next) => {

    console.log("Error req body", req.body)
    const file = req.file;
    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        req.flash("error", error)
        return next(error);
    }

    let item = new Item(req.body)
    item.image = "/uploads/" + file.filename;

    item
        .save()
        .then(() => {
            res.redirect("/home");
            req.flash("success", "item created")
        })
        .catch(err => {
            console.log(err);
            res.redirect("/home")
            req.flash("error", err)
        });
});

module.exports = router;
