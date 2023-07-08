const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    link: {type: String}
});

module.exports = mongoose.model("Image", ImageSchema);