const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    messages: [{
        name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        notUser: String,
        msg: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
})

const Chat = mongoose.model('Chat', chatSchema)
module.exports = Chat