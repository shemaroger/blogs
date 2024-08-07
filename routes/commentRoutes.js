const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { validateAuth } = require('../middleware/authMiddleware');

router.post('/:blogId', validateAuth, commentController.addComment);
router.get('/:blogId', commentController.getComments);

module.exports = router;
