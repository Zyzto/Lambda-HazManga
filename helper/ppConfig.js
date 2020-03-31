const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const User = require("../models/user.model")

/*
 * Passport "serializes" objects to make them easy to store, converting the
 * user to an identifier (id)
 *
 * {"user_id": "1234"}
 */
passport.serializeUser(function (user, done) {
    done(null, user.id)
})

/*
 * Passport "deserializes" objects by taking the user's serialization (id)
 * and looking it up in the database
 */
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user)
    })
})

passport.use(
    new LocalStrategy({
            usernameField: "email", // must match input field name
            passwordField: "password"
        },
        function (email, password, done) {
            User.findOne({
                email: email
            }, function (err, user) {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    return done(null, false)
                }
                if (!user.verifyPassword(password)) {
                    return done(null, false)
                }
                return done(null, user)
            })
        }
    )
)

module.exports = passport;