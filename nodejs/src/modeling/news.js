const mongoose = require("mongoose");

const newsmodel = mongoose.Schema({
  photoCloudinaryId: { type: String,default:"" }, // Cloudinary public_id for photo
  title: {
    type: String,
    trim: true,
    default: null,
  },
  photo: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [400, "Text cannot be more than 500 characters long"],
  },
  category: {
    type: String,
    trim: true,
  },
  articleUrl: {
    type: String,
    trim: true,
    default: "",
  },
  breakingnews: {
    type: Number,
    trim: true,
    default: 0,
  },
  trending: {
    type: Number,
    trim: true,
    default: 0,
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
