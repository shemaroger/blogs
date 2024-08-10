const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { validateAuth } = require('../middleware/authMiddleware');

// Like Routes
router.post('/:blogId/likes', validateAuth, likeController.toggleLike);

module.exports = router;
