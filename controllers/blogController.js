const Blog = require('../models/Blog');
const { cloudinary } = require('../config/cloudinary');

exports.createBlog = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the body data
    console.log('Uploaded File:', req.file); // Log the file data

    let imageData = {};
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageData = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    const newBlog = new Blog({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      image: imageData
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (req.file) {
      if (blog.image && blog.image.public_id) {
        await cloudinary.uploader.destroy(blog.image.public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      blog.image = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.author = req.body.author || blog.author;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.image && blog.image.public_id) {
      await cloudinary.uploader.destroy(blog.image.public_id);
    }

    await blog.remove();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
