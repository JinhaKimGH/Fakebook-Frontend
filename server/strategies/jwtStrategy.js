require('dotenv').config();
const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/user');

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.SECRET;

module.exports = new jwtStrategy(options, async (payload, done) => {
    const user = await User.findOne({email: payload.email});
    if (user) {
        return done(null, user);
    } else {
        return done(null, false, {message: "User doesn't exist."})
    }
});