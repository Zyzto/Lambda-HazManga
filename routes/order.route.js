const router = require("express").Router();
const User = require("../models/user.model");
const Item = require("../models/item.model");
const Order = require("../models/order.model");
const flash = require('connect-flash')
const {
    check,
    validationResult
} = require("express-validator");


router.get('/order', (request, response) => {
    Order.find().populate('Item').populate('User').then(order => {
        response.render('/order', {order})
    })
})

module.exports = router