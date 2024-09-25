const newsmodel = require("../modeling/news");
const cload = require("../cload/cloadinary");

const deleteNews = async (req, res) => {
  try {
    const newsId = req.params.id;
    const news = await newsmodel.findById(newsId);

    if (!news) {
      return res.status(404).json({ message: "News not found!" });
    }

    // Remove the associated images from Cloudinary
    if (news.photoCloudinaryId) {
      await cload.uploader.destroy(news.photoCloudinaryId); // Delete the photo from Cloudinary
    }
    if (news.logoCloudinaryId) {
      await cload.uploader.destroy(news.logoCloudinaryId); // Delete the logo from Cloudinary
    }

    // Remove the news from the database
    await newsmodel.findByIdAndDelete(newsId);
    res.status(200).json({ message: "News deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateNews = async (req, res) => {
  try {
    const newsId = req.params.id;
    const { title, description, likes, noLikes, commant, trending, updatedAt } =
      req.body;

    // Find the existing news by ID
    const news = await newsmodel.findById(newsId);

    if (!news) {
      return res.status(404).json({ message: "News not found!" });
    }

    // Update the news fields
    news.title = title || news.title;
    news.description = description || news.description;
    news.likes = likes || news.likes;
    news.noLikes = noLikes || news.noLikes;
    news.commant = commant || news.commant;
    news.trending = trending || news.trending;
    news.updatedAt = updatedAt || news.updatedAt;

    // If a new photo is uploaded, remove the old photo and upload the new one to Cloudinary
    if (req.files && req.files["photo"]) {
      if (news.photoCloudinaryId) {
        await cload.uploader.destroy(news.photoCloudinaryId); // Delete the old photo from Cloudinary
      }
      const photoUpload = await cload.uploader.upload(
        req.files["photo"][0].path,
        {
          folder: "photo", // Assuming photo is stored in the 'photo' folder
          public_id: `${news.title}_photo_${Date.now()}`,
        }
      );
      news.photo = photoUpload.secure_url; // Update the photo URL
      news.photoCloudinaryId = photoUpload.public_id; // Update the Cloudinary ID
    }

    // If a new logo is uploaded, remove the old logo and upload the new one to Cloudinary
    if (req.files && req.files["logo"]) {
      if (news.logoCloudinaryId) {
        await cload.uploader.destroy(news.logoCloudinaryId); // Delete the old logo from Cloudinary
      }
      const logoUpload = await cload.uploader.upload(
        req.files["logo"][0].path,
        {
          folder: "photo", // Assuming logo is stored in the 'photo' folder
          public_id: `${news.title}_logo_${Date.now()}`,
        }
      );
      news.logo = logoUpload.secure_url; // Update the logo URL
      news.logoCloudinaryId = logoUpload.public_id; // Update the Cloudinary ID
    }

    // Save the updated news
    const updatedNews = await news.save();
    res.status(200).json(updatedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const news = await newsmodel.find();
    res.json({ news: news,status:200 });
  } catch (error) {
    console.log(error);
  }
};

const getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const news = await newsmodel.findById(id);
    if (news == null) {
      return res.json({ message: "News not found" });
    }
    res.json({ news: news, message: "News found successfuly" });
  } catch (error) {
    console.log(error);
  }
};

const create = async (req, res) => {
  try {
    const { title, description, likes, noLikes, commant, trending } = req.body;

    // Check if the title is provided
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required!" });
    }

    // Initialize a new news model with the non-file fields
    const newNews = new newsmodel({
      title,
      description,
      likes,
      noLikes,
      commant,
      trending,
    });

    // Check if both photo and logo files are uploaded
    if (req.files && req.files["photo"] && req.files["logo"]) {
      // Upload photo to Cloudinary and get the public_id
      const photoUpload = await cload.uploader.upload(
        req.files["photo"][0].path,
        {
          folder: "photo",
          public_id: `${title}_photo_${Date.now()}`,
        }
      );

      // Upload logo to Cloudinary and get the public_id
      const logoUpload = await cload.uploader.upload(
        req.files["logo"][0].path,
        {
          folder: "logo",
          public_id: `${title}_logo_${Date.now()}`,
        }
      );

      // Store Cloudinary URLs and IDs in the database
      newNews.photo = photoUpload.secure_url; // Storing Cloudinary photo URL
      newNews.logo = logoUpload.secure_url; // Storing Cloudinary logo URL
      newNews.photoCloudinaryId = photoUpload.public_id; // Storing photo Cloudinary ID
      newNews.logoCloudinaryId = logoUpload.public_id; // Storing logo Cloudinary ID
    } else {
      return res
        .status(400)
        .json({ message: "Both photo and logo are required!" });
    }

    // Save the news to the database
    const savedNews = await newNews.save();

    // Return the saved news as the response
    res.status(201).json(savedNews);
  } catch (error) {
    // Handle errors and return a 400 status with the error message
    console.error("Error creating news:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { deleteNews, updateNews, getAll, getOne, create };
