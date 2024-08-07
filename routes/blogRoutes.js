const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { validateAuth } = require('../middleware/authMiddleware');
const { validateSignup, validateLogin, validateBlog } = require('../middleware/validationMiddleware');
const multer = require('multer');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Blog Routes
router.post('/', validateAuth, upload.single('image'), validateBlog, blogController.createBlog);
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', validateAuth, upload.single('image'), validateBlog, blogController.updateBlog);
router.delete('/:id', validateAuth, blogController.deleteBlog);

module.exports = router;
