import axios from "axios";
import React, { useEffect, useState } from "react";
import BackgroundImageManager from "../components/BackgroundImageManager";
import { Setbg } from "../components/backgroundStore";
import { useNavigate } from "react-router-dom";
import { id_bg } from "../components/ID_BG";
import FullPageLoader from "../components/FullPageLoader";

function Background() {
  const [isLoader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [background, setBG] = useState(null);

  const handleFetchDataBG = async () => {
    try {
      setLoader(true); // Start loading
      const response = await axios.get(
        "https://manage-news-server134.vercel.app/background-getAll"
      );
      if (response.status === 200) {
        setBG(response.data);
      }
      setLoader(false); // Stop loading once data is fetched
    } catch (error) {
      alert("Error: Can't access data");
      setLoader(false); // Stop loader on error
    }
  };

  useEffect(() => {
    handleFetchDataBG(); // Fetch data on mount
  }, []); // Empty dependency array to avoid infinite loop

  const handleGetImageById = async (imageId) => {
    try {
      const response = await axios.get(
        `https://manage-news-server134.vercel.app/background-get/${imageId}`,
        {
          // Add headers if needed
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem("admin_access_token")}`,
          // },
        }
      );
      if (response.status === 200) {
        const adminToken = localStorage.getItem("admin_access_token");
        const responseSetbg = await axios.put(
          `https://manage-news-server134.vercel.app/background-set/${imageId}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`, // Add token to headers
            },
          }
        );
        if (responseSetbg.data.message === "set background successfuly") {
          alert("Background set successfully");
          localStorage.setItem("background", JSON.stringify(response.data));
          if (Setbg() !== null) {
            navigate("/background");
          }
        }
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
      alert("Image deleted successfully");
      if (response.status === 200) {
        if (id_bg() === imageId) {
          const defaultBackground = {
            bgurl:
              "https://res.cloudinary.com/doathl3dp/image/upload/v1726764522/vbuqragemi8thbwy1vfy.webp",
            createdAt: "2024-09-18T10:51:21.423Z",
            __v: 0,
            _id: "98756782",
          };
          localStorage.setItem("background", JSON.stringify(defaultBackground));
          window.location.reload();
        }
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
        <FullPageLoader /> // Display loader while data is being fetched
      ) : (
        <div className="p-4 md:p-6">
          <BackgroundImageManager
            background={background}
            handleGetImageById={handleGetImageById}
            handleDeleteImageById={handleDeleteImageById}
            handleImageUpload={handleImageUpload}
          />
        </div>
      )}
    </div>
  );
}

export default Background;
