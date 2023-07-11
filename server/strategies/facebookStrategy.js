const FacebookTokenStrategy = require('passport-facebook-token');
const passport = require('passport');
const User = require('../models/user');

require('dotenv').config()

module.exports = new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    fbGraphVersion: "v3.0",
    }, (async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({facebookId: profile.id});

        if(user) {
            return done(null, user);
        } else {
            const newUser = new User({
                facebookId: profile.id,
                firstName: profile._json.first_name,
                lastName: profile._json.last_name,
                gender: profile._json.gender,
                email: profile._json.email,
                accountCreationDate: new Date(),
            });
            await newUser.save();
            return done(null, newUser);
        }
    }));
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    await User.findById(id, (err, user) => {
        done(err, user);
    });
});