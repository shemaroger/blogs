const Joi = require('joi');

exports.validateSignup = (req, res, next) => {
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

exports.validateBlog = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().required(),
    // Image data is optional
    image: Joi.object({
      url: Joi.string().uri().optional(),
      public_id: Joi.string().optional()
    }).optional()
  });

  // Extract data from req.body and req.file
  const data = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    image: req.file ? {
      url: req.file.path, // Assuming you use file path for image URL temporarily
      public_id: req.file.filename // Temporarily use the filename as public_id
    } : undefined
  };

  const { error } = schema.validate(data);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};