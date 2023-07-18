const User = require("../models/user");
const Post = require('../models/post')
const asyncHandler = require("express-async-handler");

exports.user_posts_get = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user) {
            return res.status(404).json({message: 'User not found.'})
        }
        
        const posts = await Post.find({'_id': {$in: user.posts}});
        if(posts.length === 0){
            return res.status(404).json({message: "Posts not found"})
        }
        return res.json({message: 'Success', posts});
    } catch (error){
        return res.status(500).json({ message: "Internal Server Error." });
    }
})

exports.user_create_post = asyncHandler(async (req, res, next) => {
    const {user, text, link, image} = req.body;

    if(text == ''){
        res.json({message: 'Error'})
    } else {
        const post = new Post({user: user, text: text,  link: link, postTime: new Date(), image: image});
        await post.save();
        await User.findByIdAndUpdate(user, {"$push": {'posts': post._id}});
        res.json({message: "Success"});
    }
        
});

exports.update_likes_put = asyncHandler(async (req, res, next) => {
    const {user} = req.body;

    try{
        if (user == ''){
            return res.status(404).json({message: 'User not found.'});
        } else {
            if(req.params.increase == 'increase'){
                const post = await Post.findByIdAndUpdate(req.params.id, {"$push": {'likes': user}});
            } else {
                const post = await Post.findByIdAndUpdate(req.params.id, {"$pull": {'likes': user}});
            }
            res.json({message: 'Success'})
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error."});
    }
})