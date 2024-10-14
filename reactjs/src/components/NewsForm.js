import React, { useState } from "react";
import { FaImage, FaTimes } from "react-icons/fa"; // Font Awesome icons
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Function to get the admin token from localStorage
export const Admin_access_token = () => {
  return localStorage.getItem("admin_access_token");
};

const NewsForm = ({ lengDiscription, handleLength }) => {
  const [error, setError] = useState({ photo: false });
  // State to store form data
  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    photo: null,
    articleUrl: "",
    category: "កម្ពុជា",
    photoPreview: null,
    description: "",
    breakingnews: 0,
    trending: 0,
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image uploads and previews
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      setFormData({
        ...formData,
        [name]: file,
        [`${name}Preview`]: URL.createObjectURL(file),
      });
      setError({ ...error, photo: false });
    }
  };

  // Remove image preview
  const handleRemoveImage = (name) => {
    setFormData({
      ...formData,
      [name]: null,
      [`${name}Preview`]: null,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the form data
    const dataToSubmit = new FormData();
    dataToSubmit.append("title", formData.title);
    dataToSubmit.append("photo", formData.photo);
    dataToSubmit.append("description", formData.description);
    dataToSubmit.append("breakingnews", formData.breakingnews);
    dataToSubmit.append("trending", formData.trending);
    dataToSubmit.append("category", formData.category);
    dataToSubmit.append("articleUrl", formData.articleUrl);

    // Validation
    if (!formData.photo) {
      setError({ ...error, photo: true });
      return;
    }
    if (dataToSubmit) {
      setLoading(true);
    }
    try {
      // Make the POST request with the admin token
      const response = await fetch("https://manage-news-server134.vercel.app/upload-news", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Admin_access_token()}`,
        },
        body: dataToSubmit,
      });

      if (response.ok) {
        // Handle success - clear the form
        setLoading(false);
        setFormData({
          title: "",
          photo: null,
          articleUrl: "",
          category: "កម្ពុជា",
          photoPreview: null,
          description: "",
          breakingnews: 0,
          trending: 0,
        });
        alert("News uploaded successfully!");
      } else {
        // Handle error response
        setLoading(false);
        const errorData = await response.json();
        console.error("Error uploading news:", errorData);
        alert("Failed to upload news. Please try again.");
      }
    } catch (error) {
      // Handle request error
      console.error("Error occurred during upload:", error);
      alert("Error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full md:max-w-[600px] mx-auto md:p-5 p-4 bg-white bg-opacity-50 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center md:text-center uppercase">
        News Input Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-semibold text-sm">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the news title"
            className="mt-1 block w-full p-2 border rounded-md focus:outline-none text-black bg-white bg-opacity-50 text-sm"
            required
          />
        </div>

        {/* Description */}
        <div>
          <div className=" flex items-center justify-between text-sm">
            <label className="block font-semibold">Description</label>
            <label className="block text-sm font-semibold">
              {lengDiscription} / 400 characters
            </label>
          </div>
          <textarea
            maxLength={400}
            name="description"
            value={formData.description}
            onChange={(event) => {
              handleChange(event);
              handleLength(event.target.value.length);
            }}
            placeholder="Enter the news description"
            className="mt-1 h-20 block w-full p-2 border rounded-md focus:outline-none text-black bg-white bg-opacity-50 text-sm"
            rows="4"
            required
          ></textarea>
        </div>

        {/* aticle url */}
        <div>
          <label className="block font-semibold text-sm">
            Article Url{" "}
            <span className="text-xs text-red-700">
              *This field you can skip.
            </span>
          </label>
          <input
            type="text"
            name="articleUrl"
            value={formData.articleUrl}
            onChange={handleChange}
            placeholder="Enter the article url"
            className="mt-1 block w-full p-2 border rounded-md focus:outline-none text-black bg-white bg-opacity-50 text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4">
          {/* breakingnews */}
          <div className="w-full sm:w-1/4">
            <label className="block font-semibold text-sm">Breaking News</label>
            <select
              name="breakingnews"
              value={formData.breakingnews}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:outline-none text-black bg-white bg-opacity-50 text-sm"
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
          {/* Trending */}
          <div className="w-full sm:w-1/4">
            <label className="block font-semibold text-sm">Trending</label>
            <select
              name="trending"
              value={formData.trending}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:outline-none text-black bg-white bg-opacity-50 text-sm"
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          {/* category */}
          <div className="w-full sm:w-1/4">
            <label className="block font-semibold text-sm">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md focus:outline-none text-black bg-white bg-opacity-50 text-sm"
            >
              <option value="កម្ពុជា">កម្ពុជា</option>
              <option value="sport">Sport</option>
              <option value="technology">Technology</option>
              <option value="health">Health</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Photo Image */}
          <div className="relative">
            <label className="block font-semibold text-sm">Photo</label>
            <input
              type="file"
              id="photoInput"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="photoInput"
              // className="flex items-center justify-center w-40 h-24 border rounded-md cursor-pointer bg-white bg-opacity-50"
              className={`flex items-center justify-center w-40 h-24 border rounded-md cursor-pointer bg-white bg-opacity-50 ${
                error.photo ? "border border-red-500" : "border-none"
              }`}
            >
              {formData.photoPreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={formData.photoPreview}
                    alt="News content"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage("photo")}
                    className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-md"
                  >
                    <FaTimes className="text-red-500" />
                  </button>
                </div>
              ) : (
                <FaImage className="text-gray-400 text-3xl" />
              )}
            </label>
            {/* Display error if photo is not uploaded */}
            {error.photo && (
              <p className="text-red-500 text-sm mt-1">Photo is required.</p>
            )}
          </div>
        </div>

        {/* Submit and Back Buttons */}
        <div className="flex justify-between mt-4">
          {/* Back Button */}
          <Link to={"/news"} className="focus:outline-none">
            <button className=" inline-flex items-center justify-center w-full md:w-auto p-2.5 md:p-4 bg-red-700 hover:bg-red-800 text-white rounded-lg md:rounded-lg focus:outline-none select-none">
              <FiArrowLeft className="mr-2" />
              Back
            </button>
          </Link>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className={`md:w-[200.22px] w-[180px] py-2.5 text-white rounded-lg bg-blue-600 hover:bg-blue-700 select-none focus:outline-none shadow-md transition-transform transform hover:scale-105 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0114.046-4.637A6.014 6.014 0 0012 6c-3.313 0-6 2.687-6 6s2.687 6 6 6c1.356 0 2.641-.451 3.641-1.212A8.045 8.045 0 014 12z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit"
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
