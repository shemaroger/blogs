const Blog = require('../models/Blog');

exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const userId = req.user._id.toString();
    const likeIndex = blog.likes.indexOf(userId);

    if (likeIndex === -1) {
      blog.likes.push(userId);
    } else {
      blog.likes.splice(likeIndex, 1);
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog.likes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
