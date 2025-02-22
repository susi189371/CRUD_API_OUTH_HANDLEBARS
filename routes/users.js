const express = require('express');
const router = express.Router();
const userController = require('../app/api/controllers/users');
router.get('/getAll', userController.getAll);
router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);
module.exports = router;