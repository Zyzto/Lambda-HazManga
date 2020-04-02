const router = require("express").Router();
const User = require("../models/user.model");
const Item = require("../models/item.model");
const Order = require("../models/order.model");
const flash = require('connect-flash')
const async = require('async')

const {
    check,
    validationResult
} = require("express-validator");


router.get('/order', (request, response) => {
    Order.find().populate('Item').populate('User').then(order => {
        response.render('/order', {
            order
        })
    })
})

router.delete('/cart/delete/:id', (request, response) => {
    // User.findById(response.locals.currentUser._id).then((user) => {
    //     let index = user.cart.findIndex((e) => {
    //         return e.equals(request.params.id)
    //     })
    //     console.log(index);
    //     console.log('user.cart length BEFORE', user.cart.length);
    //     user.cart.splice(index, 1)
    //     console.log('user.cart length AFTER', user.cart.length);
    //     user.save().then(() => {
    //         response.redirect('/cart')
    //         request.flash('success', 'Item has been removed')
    //     })
    // })
    User.findByIdAndUpdate(response.locals.currentUser._id, {
        $pull: {
            cart: request.params.id
        }
    }).then(() => {
        response.redirect('/cart')
        request.flash('success', 'Item has been removed')
    })
})

router.put('/cart/update/add/:id', (request, response, next) => {
    const choosenItem = request.params.id
    const qty = request.body.qty
    const itemQTY = request.body.itemQTY
    if (qty + 1 < itemQTY) {
        User.findById(response.locals.currentUser._id).then((user) => {
            user.cart.push(choosenItem)
            user.save().then(() => {
                response.redirect('/cart')
                request.flash('success', 'Item has been added')
            })
        })
    } else {
        response.redirect('/cart')
        request.flash('error', 'max Quantity reached')
    }
})

router.put('/cart/update/remove/:id', (request, response, next) => {
    const choosenItem = request.params.id
    const qty = request.body.qty
    const itemQTY = request.body.itemQTY
    if (qty -1 > 0) {
        User.findById(response.locals.currentUser._id).then((user) => {
            let index = user.cart.findIndex((e) => {
                return e.equals(choosenItem)
            })
            user.cart.splice(index, 1)
            user.save().then(() => {
                response.redirect('/cart')
                request.flash('success', 'Item has been removed')
            })
        })
    } else {
        response.redirect('/cart')
        request.flash('error', 'min Quantity reached')
    }
})

// router.get()

module.exports = router