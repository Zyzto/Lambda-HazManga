require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash"); // displays on time msgs
// const passport = require("./config/passportConfig");

//init
const server = express();

//Routers
const authRoutes = require("./routes/auth.route");
//

//mongoDB connection
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,

    useUnifiedTopology: true
}, () => console.log(`Connected to ${process.env.MONGODB}`), (err) => console.log(`MongoDB ERROR: ${err}`))

//body praser
server.use(express.urlencoded({
    extended: true
}))
server.set('view engine', 'ejs') //ejs-layouts
server.use(expressLayouts)

server.get('*/', (req, res) => {
    res.status(404).send('Error 404')
})

//app.use(<routes>)
server.use(authRoutes)

//


server.listen(process.env.PORT, () => console.log(`connected to Express on port: ${process.env.PORT}`))