const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    cover: { data: Buffer, contentType: String },
    publishedAt: { type: Date, default: Date.now },
});

postSchema.virtual("url").get(function () {
    return `/posts/${this._id}`;
});

module.exports = mongoose.model("Post", postSchema);
