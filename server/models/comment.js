const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    text: {type: String, required: true},
    commentTime: {type: Date, required: true},
    replies: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    likes: [{type: Schema.Types.ObjectId, ref: "User"}]
});

// Formatted Date of Post
CommentSchema.virtual("formatted_time").get(function () {
    return format(new Date(this.commentTime), "dd MMMM yyyy ' at ' HH:mm");
});

module.exports = mongoose.model("Comment", CommentSchema);