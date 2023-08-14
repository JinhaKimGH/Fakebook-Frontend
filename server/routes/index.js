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

/* POST Facebook Login Page */
router.post('/facebookLogin', authController.login_fakebook);

// User Routes 

/* GET posts from a specific user */
router.get('/getposts/:id', passport.authenticate("jwt", { session: false }), postController.user_posts_get);

/* GET user object from id */
router.get('/user/:id', passport.authenticate("jwt", {session: false}), userController.user_get);

/* PUT updates user information */
router.put('/updateuser', passport.authenticate('jwt', {session: false}), userController.user_update);

/* GET users from search */
router.get('/searchusers/:name', passport.authenticate('jwt', {session: false}), userController.user_get_by_name);

/* PUT send sfriend requests */
router.put('/friend_req', passport.authenticate('jwt', {session: false}), userController.user_friend_request_put);

/* PUT Accept Friend Requests */
router.put('/accept_req', passport.authenticate('jwt', {session: false}), userController.user_accept_request_put);

/* PUT Deny Friend Requests */
router.put('/deny_req', passport.authenticate('jwt', {session: false}), userController.user_deny_request_put);

/* PUT Remove Friend */
router.put('/unfriend', passport.authenticate('jwt', {session: false}), userController.user_unfriend_put);

/* GET Birthdays */
router.get('/birthdays/:id', passport.authenticate('jwt', {session: false}), userController.user_birthday_get);

/* PUT Add post to user saved posts */
router.put('/addsavedpost', passport.authenticate('jwt', {session: false}), userController.save_post)

/* PUT Remove post from user saved posts */
router.put('/removesavedpost', passport.authenticate('jwt', {session: false}), userController.unsave_post)

/* GET All saved posts from a user */
router.get('/getsavedposts/:user_id', passport.authenticate('jwt', {session: false}), userController.get_saved_posts)

// Post Routes

/* POST Creates a post */
router.post('/createpost', passport.authenticate("jwt", {session: false}), postController.user_create_post);

/* PUT Update Post Likes */
router.put('/updatepost/:id/:increase', passport.authenticate('jwt', {session: false}), postController.update_likes_put);

/* GET a singular post */
router.get('/getpost/:id', passport.authenticate('jwt', {session: false}), postController.get_post);

/* GET homepage posts */
router.get('/gethomeposts/:user_id', passport.authenticate('jwt', {session: false}), postController.get_recent_posts);

/* POST Deletes a Post */
router.post('/deletepost/', passport.authenticate('jwt', {session: false}), postController.delete_post);

// Comment Routes

/* POST Creates a Comment */
router.post('/createcomment', passport.authenticate('jwt', {session: false}), commentController.comment_post);

/* GET Comment */
router.get('/getcomment/:id', passport.authenticate('jwt', {session: false}), commentController.get_comment);

/* PUT Comment Likes */
router.put('/updatecomment', passport.authenticate('jwt', {session: false}), commentController.put_comment_likes);

/* POST Comment Replies */
router.post('/createreply', passport.authenticate('jwt', {session: false}), commentController.create_reply_post);

module.exports = router;
