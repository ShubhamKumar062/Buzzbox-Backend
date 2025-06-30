const Post = require("../model/post");
const User = require("../model/user");
const Group = require("../model/group");
const Poll = require('../model/poll');


exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "admin" || user.role === "moderator") {
      await Post.deleteOne({ _id: req.params.id });
      return res.json({ message: "Post deleted successfully" });
    } else {
      return res.status(403).json({ message: "Access denied: not authorized" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error while deleting post" });
  }
};

exports.addModerator = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    const user = await User.findById(req.params.userId);
    if (!group || !user) {
      return res.status(404).json({ message: "Group or User not found" });
    }
    if (group.admin.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to add moderators" });
    }
    group.moderators.push(user.id);
    await group.save();
    res.json({
      message: "Moderator added successfully",
      group,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error while adding moderator" });
  }
};

module.exports.deletePoll = async (req, res) => {
  try {
    const pollId = req.params.id;
    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (req.user.role !== "admin" && req.user.role !== "moderator") {
      return res.status(403).json({ message: "Not authorized to delete poll" });
    }

    await Poll.deleteOne({ _id: pollId });
    res.json({ message: "Poll deleted successfully" });
  } catch (err) {
    console.error("Poll deletion failed:", err.message);
    res.status(500).json({ message: "Server error while deleting poll" });
  }
};
