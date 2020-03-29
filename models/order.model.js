const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    item: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        enum: ['processing', 'shipped', 'delivered'],
        type: String,
        default: 'processing'
    },
    payment: {
        isCash: Boolean,
        cardNumber: Number,
        secretCode: Number,
        expDate: String
    }
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order