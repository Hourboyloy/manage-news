import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import NewsDetail from "../components/NewsDetail";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FullPageLoader from "../components/FullPageLoader";

function Details() {
  const Navigate = useNavigate();
  const { id } = useParams(); // Destructure id from useParams
  const [data, setData] = useState();
  const [isloading, setLoading] = useState(true);
  const [isfound, setfound] = useState(true);
  const handleGetbyID = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://manage-news-server134.vercel.app/getone/${id}`
      );
      if (res.status === 200) {
        setLoading(false);
        if (res.data.message === "News not found") {
          setfound(false);
        } else {
          setData(res.data.news);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [id]); // Depend on id to re-fetch data when id changes

  useEffect(() => {
    handleGetbyID();
  }, [handleGetbyID]); // Depend on handleGetbyID

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // handle delete
  const handleDelete = async () => {
    const adminToken = localStorage.getItem("admin_access_token");

    try {
      const response = await axios.delete(
        `https://manage-news-server134.vercel.app/remove-news/${id}`, // URL with item ID
        {
          headers: {
            Authorization: `Bearer ${adminToken}`, // Add token to headers
          },
        }
      );

      if (response.status === 200) {
        alert("News item deleted successfully.");
        Navigate("/news");
      } else {
        alert("Failed to delete the news item.");
      }
    } catch (error) {
      console.error("Error deleting the item", error);
      alert("Error deleting the item. Please try again.");
    }
  };

  return (
    <div>
      {isloading ? (
        <FullPageLoader />
      ) : isfound ? (
        <div className="min-h-[90.8vh] flex items-center justify-center">
          <NewsDetail
            data={data}
            isExpanded={isExpanded}
            toggleExpanded={toggleExpanded}
            handleDelete={handleDelete}
            id={id}
          />
        </div>
      ) : (
        <div className="xl:text-4xl lg:text-3xl md:text-2xl text-xl text-white font-bold h-[90vh] flex justify-center items-center">
          Not Found
        </div>
      )}
    </div>
  );
}

export default Details;
