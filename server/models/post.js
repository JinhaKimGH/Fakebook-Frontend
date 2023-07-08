const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    text: {type: String, required: true},
    link: {type: String},
    postTime: { type: Date, required: true },
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    image: [{type: Schema.Types.ObjectId, ref: "Image"}],
    likes: [{type: Schema.Types.ObjectId, ref: "User"}]
});

// Formatted Date of Post
PostSchema.virtual("formatted_time").get(function () {
    return format(new Date(this.postTime), "dd MMMM yyyy ' at ' HH:mm");
});

module.exports = mongoose.model("Post", PostSchema);