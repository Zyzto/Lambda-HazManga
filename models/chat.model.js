const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    messages: [{
        msg: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
})

const Chat = mongoose.model('Chat', chatSchema)
module.exports = Chat