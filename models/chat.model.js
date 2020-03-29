const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    messages: [{
        msg: String,
        timestamps: {
            createdAt: 'created_at'
        }
    }]
})

const Chat = mongoose.model('Chat', chatSchema)
module.exports = Chat