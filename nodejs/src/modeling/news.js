const mongoose = require("mongoose");

const newsmodel = mongoose.Schema({
  photoCloudinaryId: { type: String }, // Cloudinary public_id for photo
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
  breakingnews: {
    type: Number,
    trim: true,
  },
  trending: {
    type: Number,
    trim: true,
  },
  isVisible: {
    type: Number,
    default: 1,
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
