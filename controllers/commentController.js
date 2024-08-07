const Blog = require('../models/Blog');

exports.addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const comment = {
      author: req.user._id,
      content: req.body.content
    };

    blog.comments.push(comment);
    const updatedBlog = await blog.save();
    res.status(201).json(updatedBlog.comments[updatedBlog.comments.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.json(blog.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
