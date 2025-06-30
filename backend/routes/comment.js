const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentController = require('../controller/commentController');

router.post('/:postId', auth, commentController.addComment);
router.get('/:postId', commentController.getComments);

module.exports = router;
