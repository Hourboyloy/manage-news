// background.controller.js
const Background = require("../modeling/background");
const cload = require("../cload/cloadinary");

// Upload Background Image to cload
const uploadBGImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const result = await cload.uploader.upload(req.file.path);
    const bg_model = new Background({
      bgurl: result.secure_url,
      cloadinary_id: result.public_id,
    });

    await bg_model.save();
    res.status(200).send({
      row: bg_model,
      message: "File uploaded and saved to Cloudinary and MongoDB successfully",
      file: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading background image", error });
  }
};

// Get All Background Images from cload
const getAllBGImages = async (req, res) => {
  try {
    const backgrounds = await Background.find();
    res.status(200).json(backgrounds);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving background images", error });
  }
};

// Get Background Image by ID from cload
const getBGImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const background = await Background.findById(id);

    if (!background) {
      return res.status(404).json({ message: "Background not found" });
    }

    res.status(200).json(background);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving background image", error });
  }
};

// Delete Background Image cload
const deleteBGImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the background image
    const background = await Background.findById(id);

    if (!background) {
      return res.status(404).json({ message: "Background not found" });
    }

    // Remove the image from storage (if applicable)
    if (background.bgurl) {
      await cload.uploader.destroy(background.cloadinary_id);
    }

    // Delete the background image from the database
    await background.deleteOne();

    res.status(200).json({ message: "Background image deleted successfully" });
  } catch (error) {
    console.error("Error deleting background image:", error);
    res.status(500).json({ message: "Error deleting background image" });
  }
};

module.exports = {
  uploadBGImage,
  deleteBGImage,
  getAllBGImages,
  getBGImageById,
};

