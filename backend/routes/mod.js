const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const modController = require('../controller/modController');

router.delete('/posts/:id', auth, modController.deletePost);
router.delete('/polls/:id', auth, modController.deletePoll);
router.put('/groups/:groupId/moderators/:userId', auth, modController.addModerator);

module.exports = router;