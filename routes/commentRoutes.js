const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { validateAuth } = require('../middleware/authMiddleware');

// Comment Routes
router.post('/:blogId/comments', validateAuth, commentController.addComment);
router.get('/:blogId/comments', commentController.getComments);


module.exports = router;
