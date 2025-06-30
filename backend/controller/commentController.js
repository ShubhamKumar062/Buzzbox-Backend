const Comment = require('../model/comment');
const Post = require('../model/post');

module.exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;
    const userId = req.user?.id; 
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const comment = new Comment({
      content,
      author: userId,
      post: postId
    });
    await comment.save();
    await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment._id } },
      { new: true }
    );
    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (err) {
    console.error('Add Comment Error:', err.message);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};


module.exports.getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId)
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username'
        }
      });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({
      message: 'Comments fetched successfully',
      comments: post.comments
    });
  } catch (err) {
    console.error('Get Comments Error:', err.message);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

