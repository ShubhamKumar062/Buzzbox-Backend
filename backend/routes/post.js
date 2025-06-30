const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const geo = require('../middleware/geo');
const postController = require('../controller/postController');

router.post('/', auth, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/nearby', auth, postController.getNearbyPosts); 
module.exports = router;
