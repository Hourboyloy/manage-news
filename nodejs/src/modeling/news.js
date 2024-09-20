const mongoose = require("mongoose");

const newsmodel = mongoose.Schema({
  logo: {
    type: String,
    required: true,
    trim: true,
  },
  photoCloudinaryId: { type: String }, // Cloudinary public_id for photo
  logoCloudinaryId: { type: String }, // Cloudinary public_id for logo
  title: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Text cannot be more than 500 characters long"],
  },
  likes: {
    type: Number,
    default: 0,
    trim: true,
  },
  noLikes: {
    type: Number,
    default: 0,
    trim: true,
  },
  commant: {
    type: String,
    trim: true,
  },
  trending: {
    type: Number,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("news", newsmodel);