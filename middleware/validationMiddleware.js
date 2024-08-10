const Joi = require('joi');
const mongoose = require('mongoose');

// Validation for user signup
exports.validateSignup = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Validation for user login
exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Validation for blog creation and updates
exports.validateBlog = (req, res, next) => {
  // Convert `author` to string if it's an ObjectId
  const authorId = req.user._id instanceof mongoose.Types.ObjectId
    ? req.user._id.toString()
    : req.user._id;

  // Constructing the data object
  const data = {
    title: req.body.title,
    content: req.body.content,
    author: authorId, // Use the logged-in user's ID as a string
    image: req.file ? {
      url: req.file.path, // Temporarily using the file path; will be replaced by Cloudinary URL after upload
      public_id: req.file.filename // Temporarily using the filename; will be replaced by Cloudinary public_id
    } : req.body.image // Use image data from body if not uploaded
  };

  // Joi schema for blog validation
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message('Invalid author ID');
      }
      return value;
    }).required(), // Validate that author is a valid ObjectId
    image: Joi.object({
      url: Joi.string().uri().optional(),
      public_id: Joi.string().optional()
    }).optional()
  });

  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.details.map(detail => detail.message).join(', ') });
  }
  next();
};