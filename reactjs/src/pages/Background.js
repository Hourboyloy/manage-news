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
      const response = await axios.get(
        "https://manage-news-server134.vercel.app/background-getAll"
      );
      setBG(response.data);
      if (response.status === 200) {
        setLoader(true);
      }
    } catch (error) {
      alert("Error:can't accesss data");
    }
  };

  useEffect(() => {
    handleFetchDataBG(); // Fetch data when the component mounts
  }, [background]);

  const handleGetImageById = async (imageId) => {
    try {
      const response = await axios.get(
        `https://manage-news-server134.vercel.app/background-get/${imageId}`,
        {
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem(
          //     "admin_access_token"
          //   )}`,
          // },
        }
      );
      if (response.status === 200) {
        const responseSetbg = await axios.put(
          `https://manage-news-server134.vercel.app/background-get/${imageId}`
        );
        if (responseSetbg.data.message === "set background successfuly") {
          alert("successfully");
          localStorage.setItem("background", JSON.stringify(response.data));
          if (Setbg() !== null) {
            navigate("/background");
          }
        }
      }
    } catch (error) {
      alert("Error retrieving image");
      throw error;
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
      if (response) {
        if (id_bg() === imageId) {
          // Creating a fake object
          const backgroundObj = {
            bgurl:
              "https://res.cloudinary.com/doathl3dp/image/upload/v1726764522/vbuqragemi8thbwy1vfy.webp",
            createdAt: "2024-09-18T10:51:21.423Z",
            __v: 0,
            _id: "98756782",
          };

          // Store the object as a string in localStorage
          localStorage.setItem("background", JSON.stringify(backgroundObj));

          // Reload the window to apply changes
          window.location.reload();
        }
      }
      handleFetchDataBG();
      return response.data;
    } catch (error) {
      alert("Error deleting image:");
      throw error;
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Prepare form data
    const formData = new FormData();
    formData.append("bgurl", file);

    try {
      // Send a POST request to the server using axios
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
      } else if (response.status === 404) {
        alert("Image failed upload");
      }
    } catch (error) {
      console.error("Error uploading image");
    }
  };
  return (
    <div>
      {isLoader ? (
        <div className="p-4 md:p-6">
          <BackgroundImageManager
            background={background}
            handleGetImageById={handleGetImageById}
            handleDeleteImageById={handleDeleteImageById}
            handleImageUpload={handleImageUpload}
          />
        </div>
      ) : (
        <FullPageLoader />
      )}
    </div>
  );
}

export default Background;
