const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  votes: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  poll: { type: mongoose.Schema.Types.ObjectId, ref: "Poll" },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  createdAt: { type: Date, default: Date.now },
  type: { type: String, enum: ["text", "poll"], default: "text" },
});

PostSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Post", PostSchema);
