const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    gender: {type: String, required: true},
    birthday: {type: Date, required: true},
    email: {type: String, required: true},
    accountCreationDate: {type: Date, required: true},
    password: {type: String, required: true},
    friends: [{type: Schema.Types.ObjectId, ref: "User"}],
    friendRequests: [{type: Schema.Types.ObjectId, ref: "User"}],
    profilePhoto: {type: Schema.Types.ObjectId, ref: "Image"},
    posts: [{type: Schema.Types.ObjectId, ref: "Post"}]
});

module.exports = mongoose.model("User", UserSchema);