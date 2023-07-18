var express = require('express');
var router = express.Router();
const passport = require('passport')
const User = require('../models/user')
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Controller Modules
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');


// Authentication Routes

/* POST Login Page */
router.post('/login', authController.login_post);

/* POST Sign Up Page */
router.post('/signup', authController.user_signup_post);

/* POST Login Page */
router.post('/facebook-login', authController.login_fakebook);


// User Routes 
/* GET posts from a specific user */
router.get('/getposts/:id', passport.authenticate("jwt", { session: false }), postController.user_posts_get)

/* GET user */
router.get('/user/:id', passport.authenticate("jwt", {session: false}), userController.user_get)



// Post Routes

/* POST post */
router.post('/createpost', passport.authenticate("jwt", {session: false}), postController.user_create_post);

/* PUT Update Post Likes */
router.put('/updatepost/:id/:increase', passport.authenticate('jwt', {session: false}), postController.update_likes_put);

//router.get("/posts", passport.authenticate("jwt", { session: false }), postController.posts_get);

module.exports = router;
