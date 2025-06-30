const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      votes: { type: Number, default: 0 },
    },
  ],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Poll", PollSchema);
