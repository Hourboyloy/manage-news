import React, { useState } from "react";
import { FiUpload, FiTrash2, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditForm = ({ id, handleLength, lengDiscription }) => {
  const navigate = useNavigate();

  const initialFormData = {
    title: "",
    description: "",
    likes: "",
    noLikes: "",
    commant: "",
    trending: "0",
    logo: null,
    photo: null,
    logoPreview: null,
    photoPreview: null,
    updatedAt: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        [name]: file,
        [`${name}Preview`]: previewUrl,
      });
    }
  };

  const handleRemoveFile = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: null,
      [`${fieldName}Preview`]: null,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.likes || isNaN(formData.likes))
      newErrors.likes = "Likes must be a number";
    if (!formData.noLikes || isNaN(formData.noLikes))
      newErrors.noLikes = "No Likes must be a number";
    if (!formData.commant || isNaN(formData.commant))
      newErrors.commant = "commant must be a number";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const currentDate = new Date().toISOString();
    const updatedFormData = { ...formData, updatedAt: currentDate };

    const formDataToSend = new FormData();
    for (const key in updatedFormData) {
      if (updatedFormData[key]) {
        formDataToSend.append(key, updatedFormData[key]);
      }
    }

    setIsSubmitting(true);
    try {
      await axios.put(
        `https://manage-news-server134.vercel.app/edit-news/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem(
              "admin_access_token"
            )}`,
          },
        }
      );
      alert("Form submitted successfully!");
      navigate(`/details/${id}`);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="min-h-screen flex items-center justify-center pb-12 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8">
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-white bg-opacity-50 p-8 shadow-lg rounded-lg"
        >
          <h2 className="text-3xl font-extrabold text-center text-gray-800 uppercase">
            Edit Data
          </h2>
          {/* Title */}
          <div className="relative">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-800"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={`mt-1 block w-full p-4 border focus:outline-none text-black bg-white bg-opacity-50 ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
              placeholder="Enter title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                <FiAlertCircle className="inline-block mr-1" /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="relative">
            <div className=" flex items-center justify-between">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-800"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                {lengDiscription} / 500 characters
              </label>
            </div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              maxLength={500}
              onChange={(event) => {
                handleChange(event);
                handleLength(event.target.value.length);
              }}
              className={`mt-1 block w-full p-4 border focus:outline-none text-black bg-white bg-opacity-50 ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                <FiAlertCircle className="inline-block mr-1" />{" "}
                {errors.description}
              </p>
            )}
          </div>

          {/* Likes */}
          <div className="relative">
            <label
              htmlFor="likes"
              className="block text-sm font-medium text-gray-800"
            >
              Likes <span className="text-red-500">*</span>
            </label>
            <input
              id="likes"
              name="likes"
              type="number"
              value={formData.likes}
              onChange={handleChange}
              className={`mt-1 block w-full p-4 border focus:outline-none text-black bg-white bg-opacity-50 ${
                errors.likes ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
              placeholder="Enter likes"
            />
            {errors.likes && (
              <p className="text-red-500 text-sm mt-1">
                <FiAlertCircle className="inline-block mr-1" /> {errors.likes}
              </p>
            )}
          </div>

          {/* No Likes */}
          <div className="relative">
            <label
              htmlFor="noLikes"
              className="block text-sm font-medium text-gray-800"
            >
              No Likes <span className="text-red-500">*</span>
            </label>
            <input
              id="noLikes"
              name="noLikes"
              type="number"
              value={formData.noLikes}
              onChange={handleChange}
              className={`mt-1 block w-full p-4 border focus:outline-none text-black bg-white bg-opacity-50 ${
                errors.noLikes ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
              placeholder="Enter no likes"
            />
            {errors.noLikes && (
              <p className="text-red-500 text-sm mt-1">
                <FiAlertCircle className="inline-block mr-1" /> {errors.noLikes}
              </p>
            )}
          </div>

          {/* commants */}
          <div className="relative">
            <label
              htmlFor="commant"
              className="block text-sm font-medium text-gray-800"
            >
              Commants <span className="text-red-500">*</span>
            </label>
            <input
              id="commant"
              name="commant"
              type="number"
              value={formData.commant}
              onChange={handleChange}
              className={`mt-1 block w-full p-4 border focus:outline-none text-black bg-white bg-opacity-50 ${
                errors.commant ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
              placeholder="Enter commant"
            />
            {errors.commant && (
              <p className="text-red-500 text-sm mt-1">
                <FiAlertCircle className="inline-block mr-1" /> {errors.commant}
              </p>
            )}
          </div>

          {/* Trending */}
          <div className="relative">
            <label
              htmlFor="trending"
              className="block text-sm font-medium text-gray-800"
            >
              Trending
            </label>
            <select
              id="trending"
              name="trending"
              value={formData.trending}
              onChange={handleChange}
              className="mt-1 block w-full p-4 border focus:outline-none text-black bg-white bg-opacity-50 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              <option value="0">Not Trending</option>
              <option value="1">Trending</option>
            </select>
          </div>

          {/* Logo Upload */}
          <div className="relative">
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-gray-800"
            >
              Logo Upload
            </label>
            <div className="flex items-center mt-2">
              {!formData.logo && (
                <label
                  htmlFor="logo"
                  className="cursor-pointer flex items-center justify-center w-full p-4 border rounded-lg text-black bg-white bg-opacity-50 focus:outline-none transition duration-150 ease-in-out"
                >
                  <FiUpload className="text-xl mr-2" />
                  <span>Upload logo</span>
                </label>
              )}
              <input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden focus:outline-none"
              />
              {formData.logo && (
                <div className="flex items-center">
                  <img
                    src={formData.logoPreview}
                    alt="Logo Preview"
                    className="h-16 w-16 object-cover border border-gray-300 rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    className="ml-4 focus:outline-none select-none text-red-500 hover:text-red-600 transition duration-150 ease-in-out"
                    onClick={() => handleRemoveFile("logo")}
                  >
                    <FiTrash2 className="text-xl" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="relative">
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-gray-800"
            >
              Photo Upload
            </label>
            <div className="flex items-center mt-2">
              {!formData.photo && (
                <label
                  htmlFor="photo"
                  className="cursor-pointer flex items-center justify-center w-full p-4 border rounded-lg text-black bg-white bg-opacity-50 focus:outline-none transition duration-150 ease-in-out"
                >
                  <FiUpload className="text-xl mr-2" />
                  <span>Upload photo</span>
                </label>
              )}
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden focus:outline-none"
              />
              {formData.photo && (
                <div className="flex items-center">
                  <img
                    src={formData.photoPreview}
                    alt="Preview"
                    className="h-16 w-16 object-cover border border-gray-300 rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    className="ml-4 text-red-500 focus:outline-none select-none hover:text-red-600 transition duration-150 ease-in-out"
                    onClick={() => handleRemoveFile("photo")}
                  >
                    <FiTrash2 className="text-xl" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit, Clear, and Back Buttons */}
          <div className="mt-6 flex justify-between gap-4">
            <motion.button
              type="button"
              className="flex select-none items-center justify-center py-3 w-full md:w-auto md:px-6 text-white rounded-lg bg-red-600 hover:bg-red-700 focus:outline-none shadow-md transition-transform transform hover:scale-105"
              onClick={handleBack}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft className="text-xl mr-2" />
              <span>Back</span>
            </motion.button>
            <motion.button
              type="button"
              className="py-3 w-full md:w-auto md:px-6 text-white rounded-lg bg-gray-600 hover:bg-gray-700  select-none focus:outline-none shadow-md transition-transform transform hover:scale-105"
              onClick={handleCancel}
              whileTap={{ scale: 0.95 }}
            >
              Clear
            </motion.button>
            <motion.button
              type="submit"
              className={`w-full py-3 text-white rounded-lg bg-blue-600 hover:bg-blue-700 select-none focus:outline-none shadow-md transition-transform transform hover:scale-105 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
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
    </div>
  );
};

export default EditForm;
