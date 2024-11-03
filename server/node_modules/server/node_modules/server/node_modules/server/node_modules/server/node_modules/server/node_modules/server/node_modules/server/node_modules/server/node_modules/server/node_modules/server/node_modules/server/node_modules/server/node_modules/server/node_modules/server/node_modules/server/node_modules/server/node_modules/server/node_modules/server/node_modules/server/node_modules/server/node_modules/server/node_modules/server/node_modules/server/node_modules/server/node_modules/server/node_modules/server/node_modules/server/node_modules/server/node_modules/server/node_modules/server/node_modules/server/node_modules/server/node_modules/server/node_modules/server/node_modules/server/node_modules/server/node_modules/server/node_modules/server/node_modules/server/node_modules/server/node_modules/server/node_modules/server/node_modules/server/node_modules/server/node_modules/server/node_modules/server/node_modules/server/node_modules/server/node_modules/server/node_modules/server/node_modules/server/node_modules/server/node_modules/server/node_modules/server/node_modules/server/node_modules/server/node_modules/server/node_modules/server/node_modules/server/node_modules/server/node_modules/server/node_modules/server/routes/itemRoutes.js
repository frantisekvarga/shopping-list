
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authenticate = require('../middleware/auth'); 


router.post('/create-item', itemController.createItem);
router.get('/get-items', itemController.getItems);
router.get('/get-item/:id', itemController.getItem);
router.get('/search', itemController.searchItems);
router.patch('/update-item/:taskId',authenticate, itemController.updateItem);

module.exports = router;