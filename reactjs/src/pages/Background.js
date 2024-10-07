import axios from "axios";
import React, { useEffect, useState } from "react";
import BackgroundImageManager from "../components/BackgroundImageManager";
import { useNavigate } from "react-router-dom";
import FullPageLoader from "../components/FullPageLoader";

function Background() {
  const [isLoader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [background, setBG] = useState([]); // Initialize as an empty array

  const handleFetchDataBG = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        "https://manage-news-server134.vercel.app/background-getAll"
      );
      if (response.status === 200) {
        setBG(response.data);
      }
    } catch (error) {
      alert("Error: Can't access data");
      console.error(error); // Log error for debugging
    } finally {
      setLoader(false); // Ensure loader is stopped regardless of success/failure
    }
  };

  useEffect(() => {
    handleFetchDataBG();

    if (background && background.length > 0) {
      const selectedBackground = background.filter((e) => e.seted);
      if (selectedBackground.length > 0) {
        localStorage.setItem(
          "background",
          JSON.stringify(selectedBackground[0]) // Storing the first matching element
        );
      }
    }
  }, [background]);

  const handleSetImageById = async (imageId) => {
    try {
      const adminToken = localStorage.getItem("admin_access_token");
      const responseSetbg = await axios.put(
        `https://manage-news-server134.vercel.app/set-bg/${imageId}`,
        {}, // Assuming no body data is needed; modify if required
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (responseSetbg.data.message === "set background successfuly") {
        alert("Background set successfully");
        // handleFetchDataBG();
        localStorage.setItem(
          "background",
          JSON.stringify(responseSetbg.data.updatedDocument)
        );
        navigate("/background");
      }
    } catch (error) {
      alert("Error retrieving image");
      console.error(error);
    }
  };

  const handleDeleteImageById = async (imageId) => {
    try {
      const response = await axios.delete(
        `https://manage-news-server134.vercel.app/background-remove/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "admin_access_token"
            )}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Image deleted successfully");
        handleFetchDataBG(); // Refresh data after deletion
      }
    } catch (error) {
      alert("Error deleting image");
      console.error(error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("bgurl", file);

    try {
      const response = await axios.post(
        "https://manage-news-server134.vercel.app/upload-bg",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "admin_access_token"
            )}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Image uploaded successfully");
        handleFetchDataBG(); // Refresh data after upload
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      alert("Error uploading image");
      console.error(error);
    }
  };

  return (
    <div>
      {isLoader ? (
        <FullPageLoader />
      ) : (
        <div className="p-4 md:p-6">
          <BackgroundImageManager
            background={background}
            handleSetImageById={handleSetImageById}
            handleDeleteImageById={handleDeleteImageById}
            handleImageUpload={handleImageUpload}
          />
        </div>
      )}
    </div>
  );
}

export default Background;
