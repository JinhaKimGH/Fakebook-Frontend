var express = require('express');
var router = express.Router();
const passport = require('passport')
const User = require('../models/user')
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
          const user = await User.findOne({ "email": username });
          if (!user) {
              return done(null, false);
          };
          bcrypt.compare(password, user.password, (err, result) => {
              if (result) {
                // passwords match! log user in
                return done(null, user)
              } else {
                // passwords do not match!
                return done(null, false)
              }
          })
        } catch(err) {
          return done(err);
        };
      })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    console.log("THIS IS ID", id)
    try {
        const user = await User.findById(id);
        console.log("THIS IS THE USER", user)
        done(null, user);
    } catch(err) {
        done(err, null);
    };
});

// Controller Modules
const userController = require('../controllers/userController');

/* GET login page */
router.get('/', function (req, res, next) {
    res.send("Login")
})

/* POST Login Page */
router.post('/', (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if(!user){
            res.send("Incorrect email or password.")
        } else {
            req.login(user, function(err) {
                if(err) throw err;
                res.send("Success");
            })
        }
    })(req, res, next);
});

/* GET sign up page */
router.get('/signup', function (req, res, next) {
    res.send("Signup")
})

/* POST Sign Up Page */
router.post('/signup', userController.user_signup_post)

/* GET user */
router.get('/user', (req, res, next) => {
    console.log(req.user)
    res.send(req.user);
})

module.exports = router;
