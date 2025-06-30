const Post = require('../model/post');
const Group = require('../model/group');

module.exports.createPost = async (req, res) => {
  try {
    const { title, content, groupId, location } = req.body;
      const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }
    const post = await Post.create({
      title,
      content,
      group: groupId,
      author: userId,
      location,
      timestamp: new Date()
    });
    const populatedPost = await post.populate('author', 'username');
    res.status(201).json({
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

module.exports.getNearbyPosts = async (req, res) => {
  try {
    const { location } = req.body;
    if (!location || !location.coordinates || !Array.isArray(location.coordinates)) {
      return res.status(400).json({ message: 'Invalid or missing location data' });
    }
    const posts = await Post.find({
      location: {
        $near: {
          $geometry: location,
          $maxDistance: 5000
        }
      }
    })
      .populate('author', 'username')
      .populate('group', 'name')
      .populate('poll');
    res.status(200).json({
      message: 'Nearby posts fetched successfully',
      posts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to fetch nearby posts' });
  }
};
module.exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .populate('group', 'name')
      .populate('poll'); 

    res.status(200).json({ posts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
};

module.exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('group', 'name')
      .populate('poll'); 
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post fetched', post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};
