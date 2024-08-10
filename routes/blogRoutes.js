const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { validateAuth } = require('../middleware/authMiddleware');
const { validateBlog } = require('../middleware/validationMiddleware');
const { upload } = require('../config/cloudinary');

// Blog Routes
router.post('/', validateAuth, upload.single('image'), validateBlog, blogController.createBlog);
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', validateAuth, upload.single('image'), validateBlog, blogController.updateBlog);
router.delete('/:id', validateAuth, blogController.deleteBlog);

module.exports = router;