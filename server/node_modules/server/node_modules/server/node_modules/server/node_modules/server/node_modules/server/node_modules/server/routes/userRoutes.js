
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/create-user', userController.createUser);
router.post("/login",userController.Login )
router.get('/search', userController.searchUsers);
router.get('/refressh', userController.refreshToken);


module.exports = router;