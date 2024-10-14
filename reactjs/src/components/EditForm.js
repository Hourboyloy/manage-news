import React, { useState, useEffect } from "react";
import { FiUpload, FiTrash2, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditForm = ({ id, handleLength, lengDiscription, news }) => {
  const navigate = useNavigate();

  const initialFormData = {
    title: news.title,
    description:" "+news.description,
    breakingnews: news.breakingnews,
    category: news.category,
    articleUrl: news.articleUrl,
    trending: news.trending,
    photo: news.photo,
    photoPreview: news.photo,
    updatedAt: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);


   useEffect(() => {
     axios
       .get("https://manage-news-server134.vercel.app/get-categories")
       .then((response) => {
         if (response.data.status === 200) {
           setCategories(response.data.categories);
         }
       })
       .catch((err) => {
         console.log(err.message);
       });
   }, []);


  const handleChange = (e) => {
    if (formData.title) {
      setErrors({ ...errors, title: "" });
    }
    if (formData.description) {
      setErrors({ ...errors, description: "" });
    }
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "breakingnews" || name === "trending" ? Number(value) : value,
    });
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

      setErrors({ ...errors, photo: false });
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
    if (!formData.photo) newErrors.photo = "Photo is required";
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
      // Append all values, even if they are 0 (falsy values).
      if (updatedFormData[key] !== null && updatedFormData[key] !== undefined) {
        formDataToSend.append(key, updatedFormData[key]);
      }
    }

    setIsSubmitting(true);
    try {
      await axios.put(`https://manage-news-server134.vercel.app/edit-news/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
        },
      });
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
    <div className="min-h-screen flex items-center justify-center pb-12 pt-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8">
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-white bg-opacity-50 px-3 py-5 md:p-6 lg:p-8 shadow-lg rounded-lg"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 uppercase">
            Edit News
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
              className={`mt-1 block w-full p-3 text-sm border focus:outline-none text-black bg-white bg-opacity-50 ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
              placeholder="Enter new title"
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
                {lengDiscription} / 400 characters
              </label>
            </div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              maxLength={400}
              onChange={(event) => {
                handleChange(event);
                handleLength(event.target.value.length);
              }}
              className={`mt-1 block w-full h-24 text-sm px-2 py-2 border focus:outline-none text-black bg-white bg-opacity-50 ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
              placeholder="Enter new description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                <FiAlertCircle className="inline-block mr-1" />{" "}
                {errors.description}
              </p>
            )}
          </div>

          {/* acticle url */}
          <div className="relative">
            <label
              htmlFor="articleUrl"
              className="block text-sm font-medium text-gray-800"
            >
              Article Url{" "}
              <span className="text-red-600 text-xs">
                * This field you can skip.
              </span>
            </label>

            <input
              id="articleUrl"
              name="articleUrl"
              type="text"
              value={formData.articleUrl}
              onChange={handleChange}
              className={`mt-1 p-3 text-sm block w-full border focus:outline-none text-black bg-white bg-opacity-50 ${
                errors.articleUrl ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out`}
              placeholder="Enter new article url"
            />
          </div>

          {/* category */}
          <div className="relative">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-800"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full p-3 text-sm border focus:outline-none text-black bg-white bg-opacity-50 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              <option value="">Choose</option>
              {categories?.length > 0 &&
                categories.map(
                  (e, i) =>
                    e.name !== "" && (
                      <option key={e + i} value={e.name}>
                        {e.name}
                      </option>
                    )
                )}
            </select>
          </div>

          {/* breakingnews */}
          <div className="relative">
            <label
              htmlFor="breakingnews"
              className="block text-sm font-medium text-gray-800"
            >
              Breaking News
            </label>
            <select
              id="breakingnews"
              name="breakingnews"
              value={formData.breakingnews}
              onChange={handleChange}
              className="mt-1 block w-full p-3 text-sm border focus:outline-none text-black bg-white bg-opacity-50 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
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
              className="mt-1 block w-full p-3 text-sm border focus:outline-none text-black bg-white bg-opacity-50 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
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
                  className={`${
                    errors.photo ? "border border-red-500" : "border-none"
                  } cursor-pointer flex items-center justify-center w-full p-3 text-sm border rounded-lg text-black bg-white bg-opacity-50 focus:outline-none transition duration-150 ease-in-out`}
                >
                  <FiUpload className="text-lg mr-2" />
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
            {errors.photo && (
              <p className="text-red-500 text-sm mt-1">
                <FiAlertCircle className="inline-block mr-1" /> {errors.photo}
              </p>
            )}
          </div>

          {/* Submit, Clear, and Back Buttons */}
          <div className="flex items-center justify-between mt-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleBack}
              className="xl:px-6 lg:px-5 md:px-4 px-3.5 py-2.5 bg-gray-600 text-gray-50 rounded-lg shadow-sm focus:outline-none select-none hover:bg-gray-700 transition duration-150 ease-in-out"
            >
              <FiArrowLeft className="inline-block mr-2" />
              Back
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleCancel}
              className="xl:px-6 lg:px-5 md:px-4 px-3.5 py-2.5 bg-red-600 text-white rounded-lg shadow-sm focus:outline-none select-none hover:bg-red-700 transition duration-150 ease-in-out"
            >
              Clear
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="xl:px-6 lg:px-5 md:px-4 px-3.5 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm focus:outline-none select-none hover:bg-blue-700 transition duration-150 ease-in-out"
            >
              {isSubmitting ? "Submiting.." : "Submit"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditForm;
