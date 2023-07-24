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
const commentController = require('../controllers/commentController');


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

/* PUT user */
router.put('/updateuser', passport.authenticate('jwt', {session: false}), userController.user_update)


// Post Routes

/* POST post */
router.post('/createpost', passport.authenticate("jwt", {session: false}), postController.user_create_post);

/* PUT Update Post Likes */
router.put('/updatepost/:id/:increase', passport.authenticate('jwt', {session: false}), postController.update_likes_put);

/* Get singular post */
router.get('/getpost/:id', passport.authenticate('jwt', {session: false}), postController.get_post);


// Comment Routes

/* POST Create Comment */
router.post('/createcomment', passport.authenticate('jwt', {session: false}), commentController.comment_post)

/* GET Comment */
router.get('/getcomment/:id', passport.authenticate('jwt', {session: false}), commentController.get_comment);

/* PUT Comment Likes */
router.put('/updatecomment', passport.authenticate('jwt', {session: false}), commentController.put_comment_likes);

/* POST Comment Replies */
router.post('/createreply', passport.authenticate('jwt', {session: false}), commentController.create_reply_post);

//router.get("/posts", passport.authenticate("jwt", { session: false }), postController.posts_get);

module.exports = router;
