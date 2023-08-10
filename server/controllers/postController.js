const User = require("../models/user");
const Post = require('../models/post')
const asyncHandler = require("express-async-handler");

function checkImageURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

exports.get_post = asyncHandler(async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({message: 'Post not found.'})
        } else {
            return res.json({message: 'Success', post: post});
        }
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error."})
    }
})
  

exports.user_posts_get = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user) {
            return res.status(404).json({message: 'User not found.'})
        }
        
        const posts = await Post.find({'_id': {$in: user.posts}}).sort({'postTime': -1});
        if(posts.length === 0){
            return res.json({message: "Posts not found"})
        }
        return res.json({message: 'Success', posts});
    } catch (error){
        return res.status(500).json({ message: "Internal Server Error." });
    }
})

exports.user_create_post = asyncHandler(async (req, res, next) => {
    const {user, text, link, image} = req.body;

    if(text == ''){
        return res.json({message: 'Please Enter Text to Post.'})
    } else if(text.length > 300) {
        return res.status(404).json({message: "Exceeded Max Character Limit of 300."});
    } else {
        if (image != '' & link != ''){
            return res.json({message: 'You may only enter an image link or an external link, not both.'})
        }
        if ((image == '' || checkImageURL(image)) && (link == '' || isValidURL(link))){
            try{
                const post = new Post({user: user, text: text,  link: link, postTime: new Date(), image: image});
                await post.save();
                await User.findByIdAndUpdate(user, {"$push": {'posts': post._id}});
                return res.json({message: "Success", id: post._id});
            } catch (err){
                return res.status(500).json({message: "nternal Server Error."});
            }
        } else if(image != '' &!checkImageURL(image)){
            return res.json({message: "Please Enter a Valid Image URL."})
        } else{
            return res.json({message: "Please Enter a Valid External URL."})
        }
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
});

exports.get_recent_posts = asyncHandler(async (req, res, next) => {
    const user_id = req.params.user_id;
    if (user_id == ''){
        return res.status(404).json({message: 'User not found.'});
    } 

    try {
        // Finds the user first
        const curr_user = await User.findById(user_id);
        
        if(!curr_user){
            return res.status(400).json({message: "Unable to find user"});
        }
        
        // Finds all the friends of the user
        const friendsAndUser = [...curr_user.friends, user_id];
        
        // Finds all the posts from the group of friends + user, sorts it by most recent date, and only sends back 50.
        const posts = await Post.find({'user': {"$in": friendsAndUser}}).sort({'postTime': -1}).limit(50);

        if(!posts){
            return res.status(400).json({message: "Unable to find posts"});
        }

        return res.json({message: "Success", posts: posts})
    } catch (err) {
        return res.status(400).json({message: "Unable to find posts"});
    }
})