const mongoose = require("mongoose");


var itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true

    },
    description: {
        type: String,
        required: true

    },

});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item ;
