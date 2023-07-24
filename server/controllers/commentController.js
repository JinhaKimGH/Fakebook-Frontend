const Post = require("../models/post");
const Comment = require('../models/comment');
const User = require('../models/user');
const asyncHandler = require("express-async-handler");

exports.comment_post = asyncHandler(async (req, res, next) => {
    const {user, text, postID} = req.body;

    if(user == ''){
        return res.status(404).json({message: "User does not exist."});
    } if (text == ""){
        return res.json({message: 'Invalid Text'});
    } if (postID == ''){
        return res.status(404).json({message: "Post not found."});
    }

    try{
        const comment = new Comment({user: user, text: text, commentTime: new Date(), replies: [], likes: []});
        await comment.save();
        await Post.findByIdAndUpdate(postID, {"$push": {'comments': comment._id}})
        return res.json({message: "Success", id: comment._id})
    } catch (err){
        return res.status(500).json({message: "Internal Server Error."})
    }
})

exports.get_comment = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    if(id == ''){
        return res.status(404).json({message: "Comment does not exist."})
    }

    try {
        const comment = await Comment.findById(id);
        if (comment) {
            const user = await User.findById(comment.user).select({firstName: 1, lastName: 1, profilePhoto: 1});
            if (user) {
                return res.json({message: "Success", comment: comment, user: user});
            } else {
                return res.json({message: "User does not exist."});
            }
        } else {
            return res.json({message: "Comment does not exist."});
        }

    } catch (err) {
        return res.status(500).json({message: "Internal Server Error."})
    }
});

exports.put_comment_likes = asyncHandler(async (req, res, next) => {
    const {id, user, increase} = req.body;
    if(id == ''){
        return res.status(404).json({message: "Comment does not exist."});
    }

    try {
        if(user == ''){
            return res.status(404).json({message: "User does not exist."});
        } 
        const user_obj = await User.findById(user);
        
        if (user_obj) {
            if (increase) {
                const comment = await Comment.findByIdAndUpdate(id, {"$push": {"likes": user}});
                return res.json({message: "Success"});
            } else {
                const comment = await Comment.findByIdAndUpdate(id, {"$pull": {"likes": user}});
                return res.json({message: "Success"});
            }
        } else {
            return res.status(404).json({message: "User does not exist."});
        }      
    } catch (err) {
        return res.status(500).json({message: "Internal Server Error."});
    }
})

// Creates a reply to a comment
// Ensures that the user and comment both exists before
exports.create_reply_post = asyncHandler(async (req, res, next) => {
    const {user, text, commentID} = req.body;

    if(user == ''){
        return res.status(404).json({message: "User does not exist."});
    }

    if(text == ''){
        return res.status(404).json({message: "Text does not exist."});
    }

    if(commentID == ''){
        return res.status(404).json({message: "Comment does not exist."});
    }

    try{
        const user_obj = await User.findById(user);

        if(user_obj){
            const comment_obj = await Comment.findById(commentID);

            if(comment_obj){
                const reply = new Comment({user: user, text: text, commentTime: new Date(), replies: [], likes: []});
                await reply.save();
                await Comment.findByIdAndUpdate(commentID, {"$push": {'replies': reply._id}});
                return res.json({message: "Success", id: reply._id});
            } else {
                return res.status(404).json({message: "Comment does not exist."});
            }

        } else{
            return res.status(404).json({message: "User does not exist."});
        }
    } catch (err) {
        return res.status(500).json({message: "Internal Server Error."});
    }

});