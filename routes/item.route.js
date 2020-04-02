const router = require("express").Router();
const User = require("../models/user.model");
const Item = require("../models/item.model");
const flash = require('connect-flash')
const {
    check,
    validationResult
} = require("express-validator");
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
let upload = multer({
    storage: storage
});

const counta = (array) => {
    var counts = {}
    array.forEach((x) => {
        counts[x] = (counts[x] || 0) + 1
    });
    return counts
}


router.get("/home", (request, response) => {
    // request.user
    User.find().then(users => {
        Item.find().then(item => {
                response.render("home", {
                    item,
                    users
                });
            })
            .catch(err => {
                request.flash("error", err)
            })
    });
});

router.get("/item", (request, response) => {
    Item.find().then(item => {
            response.render("item", {
                item
            });
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


// router.get("/cart/add", (request, response) => {
//     // request.user
//     User.findById().then(users => {
//         Item.find().then(item => {
//             response.render("cart", { item, users });
//         })
//             .catch(err => {
//                 request.flash("error", err)
//             })
//     });
// });

router.get('/cart', (request, response) => {
    User.findById(response.locals.currentUser._id).then(user => {
        const count = counta(user.cart)
        Item.find({
            _id: user.cart
        }).then(cart => {
            response.render('cart', {
                count: count,
                cart
            })
        })
    })
})

router.put("/cart/add/:id", (request, response) => {
    Item.findById(request.params.id).then((item) => {
        User.findById(response.locals.currentUser._id).then(user => {
            // console.log('user.cart+++++++', user);
            const count = counta(user.cart)
            if ((item.quantity >= count[request.params.id] + 1) || user.cart.length == 0 || count[request.params.id] == undefined) {
                User.findByIdAndUpdate(response.locals.currentUser._id, {
                    $push: {
                        cart: request.params.id,
                    }
                }).then(() => {
                    response.redirect('/home')
                    request.flash('success', 'Item Added')
                }).catch(err => console.log('error', err))
            }
            response.redirect('/home')
            request.flash('error', 'Max Quantity')
        })
    })
});

router.delete('/item/delete/:id', (request, response) => {
    Item.findByIdAndDelete(request.params.id).then(() => {
        response.redirect('/item')
        request.flash('success', 'item deleted')
        
    }).catch(err=>{
        console.log("error",err)
    })
})


// router.get("/cart", (request, response) => {

//     response.render("cart");
// });


module.exports = router;