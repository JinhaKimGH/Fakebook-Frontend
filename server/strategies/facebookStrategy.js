const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('../models/user');
const passport = require('passport');

require('dotenv').config()

module.exports = new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    fbGraphVersion: "v3.0",
    }, (async (accessToken, refreshToken, profile, done) => {
        // Checks if user exists, if not, a new user is created
        const user = await User.findOne({facebookId: profile.id});
        if(user) {
            return done(null, user);
        } 

        const newUser = new User({
            facebookId: profile.id,
            firstName: profile._json.first_name,
            lastName: profile._json.last_name,
            gender: profile.gender !== '' ? profile.gender : 'Not Set',
            email: profile.emails ? (profile.emails[0].value !== '' ? profile.emails[0].value : `${profile.id}@email.com`) :`${profile.id}@email.com`,
            birthday: new Date("1000-01-01T00:00:00.000Z"),
            accountCreationDate: new Date(),
        });
        await newUser.save();
        return done(null, newUser);
    }));
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    await User.findById(id, (err, user) => {
        done(err, user);
    });
});