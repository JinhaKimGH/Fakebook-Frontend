const Post = require("../models/post");
const Comment = require('../models/comment');
const User = require('../models/user');
const asyncHandler = require("express-async-handler");

// Creates a comment and sends it to the database
exports.comment_post = asyncHandler(async (req, res, next) => {
    const {user, text, postID} = req.body;

    // If the user is null, a 404 error is sent
    if(user == ''){
        return res.status(404).json(
            {
                message: "User does not exist."
            });
    // If the text is null, an error message is sent
    } if (text == ""){
        return res.json(
            {
                message: 'Invalid Text'
            });
    // If the postID is null, a 404 error is sent
    } if (postID == ''){
        return res.status(404).json(
            {
                message: "Post not found."
            });
    }

    try{
        // Creates the new comment
        const comment = new Comment(
            {
                user: user, 
                text: text, 
                commentTime: new Date(), 
                replies: [], 
                likes: []
            });
        await comment.save();
        await Post.findByIdAndUpdate(
            postID, {
                "$push": {
                    'comments': comment._id
                }
            });
        return res.json(
            {
                message: "Success", 
                id: comment._id
            });
    } catch (err){
        return res.status(500).json(
            {
                message: "Internal Server Error."
            });
    }
})

// Gets the comment data from the id
exports.get_comment = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    // If the id is null, a 404 error is sent
    if(id == ''){
        return res.status(404).json(
            {
                message: "Comment does not exist."
            });
    }

    try {
        // Finds comment by id
        const comment = await Comment.findById(id);
        if (comment) {
            // Finds user information to display the name and profile photo
            const user = await User.findById(comment.user).select(
                {
                    firstName: 1, 
                    lastName: 1, 
                    profilePhoto: 1
                });
            if (user) {
                return res.json(
                    {
                        message: "Success", 
                        comment: comment, 
                        user: user
                    });
            } else {
                return res.json(
                    {
                        message: "User does not exist."
                    });
            }
        } else {
            return res.json(
                {
                    message: "Comment does not exist."
                });
        }

    } catch (err) {
        return res.status(500).json(
            {
                message: "Internal Server Error."
            });
    }
});

// Updates the likes of the comment (pushes/pulls the user to the array depending on the increase parameter)
exports.put_comment_likes = asyncHandler(async (req, res, next) => {
    const {id, user, increase} = req.body;

    // If the comment id is null, a 404 error is sent 
    if(id == ''){
        return res.status(404).json(
            {
                message: "Comment does not exist."
            });
    }

    try {
        // If the user id is null, a 404 error is sent
        if(user == ''){
            return res.status(404).json(
                {
                    message: "User does not exist."
                });
        } 
        const user_obj = await User.findById(user);
        
        if (user_obj) {
            // If increase is true, the user_id is pushed. Otherwise, it is pulled
            if (increase) {
                const comment = await Comment.findByIdAndUpdate(
                    id, {
                        "$push": {
                            "likes": user
                        }
                    });
                return res.json(
                    {
                        message: "Success"
                    });
            } else {
                const comment = await Comment.findByIdAndUpdate(
                    id, {
                        "$pull": {
                            "likes": user
                        }
                    });
                return res.json(
                    {
                        message: "Success"
                    });
            }
        } else {
            return res.status(404).json(
                {
                    message: "User does not exist."
                });
        }      
    } catch (err) {
        return res.status(500).json(
            {
                message: "Internal Server Error."
            });
    }
})

// Creates a reply to a comment
// Ensures that the user and comment both exists before
exports.create_reply_post = asyncHandler(async (req, res, next) => {
    const {user, text, commentID} = req.body;
    
    // If the user id is null, a 404 error is sent
    if(user == ''){
        return res.status(404).json(
            {
                message: "User does not exist."
            });
    }

    // If the text is null, an error message
    if(text == ''){
        return res.json(
            {
                message: "Text does not exist."
            });
    }

    // If the comment id is null, a 404 error is sent
    if(commentID == ''){
        return res.status.json(
            {
                message: "Comment does not exist."
            });
    }

    try{
        const user_obj = await User.findById(user);

        if(user_obj){
            const comment_obj = await Comment.findById(commentID);

            if(comment_obj){
                const reply = new Comment(
                    {
                        user: user,
                        text: text,
                        commentTime: new Date(),
                        replies: [],
                        likes: []
                    });
                await reply.save();
                await Comment.findByIdAndUpdate(
                    commentID, {
                        "$push": {
                            'replies': reply._id
                        }
                    });
                return res.json(
                    {
                        message: "Success", 
                        id: reply._id
                    });
            } else {
                return res.status(404).json(
                    {
                        message: "Comment does not exist."
                    });
            }

        } else{
            return res.status(404).json(
                {
                    message: "User does not exist."
                });
        }
    } catch (err) {
        return res.status(404).json(
            {
                message: "User/Comment does not exist."
            });
    }

});