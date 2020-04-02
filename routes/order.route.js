const router = require("express").Router();
const User = require("../models/user.model");
const Item = require("../models/item.model");
const Order = require("../models/order.model");
const flash = require('connect-flash')
const {
    check,
    validationResult
} = require("express-validator");

const counta = (array) => {
    var counts = {}
    array.forEach((x) => {
        counts[x] = (counts[x] || 0) + 1
    });
    return counts
}


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
    if (qty - 1 > 0) {
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

router.get('/checkout/payment', (request, response) => {
    User.findById(response.locals.currentUser._id).then(user => {
        const count = counta(user.cart)
        Item.find({
            _id: user.cart
        }).then(cart => {
            let countPrice = 0
            cart.forEach((item) => {
                countPrice += (count[item._id] * item.price)
            })
            response.render('checkout', {
                price: countPrice,
                cart
            })
        })
    })
})

router.post('/checkout/payment', (request, response) => {
    User.findById(response.locals.currentUser._id).then(user => {
        const count = counta(user.cart)
        Item.find({
            _id: user.cart
        }).then(cart => {
            let countPrice = 0
            cart.forEach((item) => {
                countPrice += (count[item._id] * item.price)
            })
            let order = new Order()
            order.user = response.locals.currentUser._id
            order.item = user.cart
            if (request.body.isCash) {
                if (request.body.isCash == 'true') {
                    order.payment.isCash = true
                    order.payment.total = countPrice + 16
                } else {
                    order.payment.isCash = false
                    order.payment.cardNumber = request.body.cardNumber
                    order.payment.secretCode = request.body.secretCode
                    order.payment.expDate = request.body.expDate
                    order.payment.total = countPrice
                }
            }
            order.save().then(() => {
                user.cart.splice(0, user.cart.length)
                user.save().then(() => {
                    response.redirect('/')
                    request.flash('success', 'Order Has been made')
                })
            }).catch(err => {
                console.log('error', err)
            })
        })
    })
})


module.exports = router