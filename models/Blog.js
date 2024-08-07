const Blog = require('../models/Blog');
const { cloudinary } = require('../config/cloudinary');

exports.createBlog = async (req, res) => {
  try {
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
