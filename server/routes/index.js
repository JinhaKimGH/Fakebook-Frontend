var express = require('express');
var router = express.Router();
const passport = require('passport')
const User = require('../models/user')
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Controller Modules
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');


// Authentication Routes

/* POST Login Page */
router.post('/login', authController.login_post);

/* POST Sign Up Page */
router.post('/signup', authController.user_signup_post);

/* POST Login Page */
router.post('/facebook-login', authController.login_fakebook);


// User Routes 

/* GET user */
router.get('/user/:id', passport.authenticate("jwt", {session: false}), userController.user_get)

//router.get("/posts", passport.authenticate("jwt", { session: false }), postController.posts_get);

module.exports = router;
