const Poll = require('../model/poll');
const Post = require('../model/post');

module.exports.createPoll = async (req, res) => {
  const { question, options, postId } = req.body;
  try {
    const newPoll = new Poll({
      question,
      options: options.map(opt => ({ text: opt })),
      author: req.user.id
    });
    const poll = await newPoll.save();
    await Post.findByIdAndUpdate(postId, { poll: poll._id });
    res.status(201).json({
      message: 'Poll created and linked to post successfully',
      poll
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error while creating poll' });
  }
};

module.exports.votePoll = async (req, res) => {
  const { pollId, optionIndex } = req.body;
  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    if (
      typeof optionIndex !== 'number' ||
      optionIndex < 0 ||
      optionIndex >= poll.options.length
    ) {
      return res.status(400).json({ message: 'Invalid option index' });
    }
    if (poll.voters.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already voted' });
    }
    poll.options[optionIndex].votes += 1;
    poll.voters.push(req.user.id);
    await poll.save();
    res.json({
      message: 'Vote registered successfully',
      poll
    });
  } catch (err) {
    console.error('Vote Poll Error:',err.message);
    res.status(500).json({ message: 'Server error while voting' });
  }
};

module.exports.getPollByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate('poll');
    if (!post || !post.poll) {
      return res.status(404).json({ message: 'Poll not found for this post' });
    }
    res.status(200).json({ poll: post.poll });
  } catch (err) {
    console.error('Fetch poll error:', err.message);
    res.status(500).json({ message: 'Server error while fetching poll' });
  }
};

