const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { validateAuth } = require('../middleware/authMiddleware');

router.post('/:blogId', validateAuth, likeController.toggleLike);

module.exports = router;
