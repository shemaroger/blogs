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
  // Extracting the data from `req.body` and `req.file`
  const data = {
    title: req.body.title,
    content: req.body.content,
    author: req.user._id.toString(), // Use the logged-in user's ID as a string
    image: req.file ? {
      url: '', // The actual URL will be set after the Cloudinary upload
      public_id: '' // Will be set after the Cloudinary upload
    } : null
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
      url: Joi.string().uri().optional(), // The URL will be validated after uploading to Cloudinary
      public_id: Joi.string().optional()
    }).optional()
  });

  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.details.map(detail => detail.message).join(', ') });
  }
  next();
};