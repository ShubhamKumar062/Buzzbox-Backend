const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const geo = require('../middleware/geo');
const groupController = require('../controller/groupController');

router.post('/', auth, groupController.createGroup);            
router.get('/', groupController.getAllGroups);                
router.get('/:id', groupController.getGroupById);            
router.get('/nearby', auth, geo, groupController.getNearbyGroups); 

module.exports = router;
