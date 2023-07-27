const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    gender: {type: String, required: true},
    birthday: {type: Date},
    email: {type: String, required: true},
    accountCreationDate: {type: Date, required: true},
    password: {type: String},
    bio: {type: String, default: "No Bio."},
    facebookId: {type: String}, 
    friends: [{type: Schema.Types.ObjectId, ref: "User", default: []}],
    friendRequests: [{type: Schema.Types.ObjectId, ref: "User", default: []}],
    outGoingFriendRequests: [{type: Schema.Types.ObjectId, ref: "User", default: []}],
    profilePhoto: {type: String, default: "https://i0.wp.com/researchictafrica.net/wp/wp-content/uploads/2016/10/default-profile-pic.jpg?ssl=1"},
    posts: [{type: Schema.Types.ObjectId, ref: "Post", default: []}]
});

module.exports = mongoose.model("User", UserSchema);