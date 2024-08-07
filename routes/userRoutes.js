const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateSignup, validateLogin } = require('../middleware/validationMiddleware');

router.post('/register', validateSignup, userController.signup);  
router.post('/login', validateLogin, userController.login);

module.exports = router;
