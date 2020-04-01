require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash"); // displays on time msgs
const passport = require("./helper/ppConfig");
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo')(session)

//init
const server = express()

//Routers
const authRoutes = require("./routes/auth.route");
const itemRoutes = require("./routes/item.route");
const orderRoutes = require("./routes/order.route");
//

//mongoDB connection
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, () => console.log(`Connected to ${process.env.MONGODB}`), (err) => console.log(`MongoDB ERROR: ${err}`))


mongoose.set("debug", true);
server.use(express.static("public")); //tells express to look in public for static files
server.use(express.urlencoded({
    extended: true
}))
server.set("view engine", "ejs")
server.use(expressLayouts)
server.use(methodOverride('_method'));

//--must be before passport
server.use(
    session({
        secret: process.env.SECRET,
        saveUninitialized: true,
        resave: false,
        // cookie: { maxAge: 360000 } //duration of session
        store: new MongoStore({
            url: process.env.MONGODB
        })
    })
)

server.use(passport.initialize())
server.use(passport.session())
server.use(flash())

server.use(function (request, response, next) {
    response.locals.alerts = request.flash() //displays one time messages
    response.locals.currentUser = request.user
    console.log(response.locals.alerts)
    next()
})

//server.use(<routes>)
server.use(authRoutes)
server.use(itemRoutes)
server.use(orderRoutes)
//

//must be after routes

server.get('/', (request, response) => {
    response.redirect('/home')
})

server.get('*', (request, response) => {
    response.render('html/404', {
        layout: false
    })
})

server.listen(process.env.PORT, () => console.log(`connected to Express on port: ${process.env.PORT}`))