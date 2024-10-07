import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import FullPageLoader from "../components/FullPageLoader";
import { FaPlusCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
// import { FaThumbsUp, FaThumbsDown, FaCommentDots } from "react-icons/fa";
import { BiSolidHide } from "react-icons/bi";

const ManageNews = () => {
  const [FecthData, setFecthData] = useState([]);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [DataPagenation, setDataPagenation] = useState([]);

  const [index, setIndex] = useState(() => {
    return JSON.parse(localStorage.getItem("index")) || 0; // Initialize from localStorage
  });
  const [startData, setStartData] = useState(() => {
    return JSON.parse(localStorage.getItem("startData")) || 0; // Initialize from localStorage
  });
  const [stopData, setStopData] = useState(() => {
    return JSON.parse(localStorage.getItem("stopData")) || 9; // Initialize from localStorage
  });
  const [listIndex, setListIndex] = useState(() => {
    return JSON.parse(localStorage.getItem("listIndex")) || 1; // Initialize from localStorage
  });

  useEffect(() => {
    localStorage.setItem("startData", JSON.stringify(startData));
    localStorage.setItem("stopData", JSON.stringify(stopData));
    localStorage.setItem("index", JSON.stringify(index));
    localStorage.setItem("listIndex", JSON.stringify(listIndex));
  }, [startData, stopData, index, listIndex]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const newStartData = 0;
      const newStopData = 9;
      const newIndex = 0;
      const newListIndex = 1;
      localStorage.setItem("startData", JSON.stringify(newStartData));
      localStorage.setItem("stopData", JSON.stringify(newStopData));
      localStorage.setItem("index", JSON.stringify(newIndex));
      localStorage.setItem("listIndex", JSON.stringify(newListIndex));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleFetchData = async () => {
    try {
      const response = await axios.get("https://manage-news-server134.vercel.app/get-all");
      setFecthData(response.data.news.reverse());
      if (response.data.status === 200) {
        setToggleLoading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []); // Fetch data only once

  const handleNext = () => {
    setStartData((prev) => prev + 10);
    setStopData((prev) => prev + 10);
    setIndex((prev) => prev + 10);
    setListIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStartData((prev) => prev - 10);
    setStopData((prev) => prev - 10);
    setIndex((prev) => prev - 10);
    setListIndex((prev) => prev - 1);
  };

  const handlePagenation = useCallback(() => {
    let data = [];
    FecthData.forEach((e, i) => {
      if (i >= startData && i <= stopData) {
        data.push(e);
      }
    });
    setDataPagenation(data);
  }, [FecthData, startData, stopData]);

  useEffect(() => {
    handlePagenation();
  }, [handlePagenation]); // Add handlePagenation as dependency

  // delete items

  const handleDelete = async (itemId) => {
    const adminToken = localStorage.getItem("admin_access_token");

    try {
      const response = await axios.delete(
        `https://manage-news-server134.vercel.app/remove-news/${itemId}`, // URL with item ID
        {
          headers: {
            Authorization: `Bearer ${adminToken}`, // Add token to headers
          },
        }
      );

      if (response.status === 200) {
        alert("News item deleted successfully.");
        handleFetchData();
      } else {
        alert("Failed to delete the news item.");
      }
    } catch (error) {
      alert("Error deleting the item. Please try again.");
    }
  };

  const handleUpdateVisibility = async (id, currentVisibility) => {
    const newVisibility = currentVisibility === 1 ? 0 : 1; // Toggle between 1 and 0
    try {
      const response = await axios.put(
        `https://manage-news-server134.vercel.app/isvisible/${id}`, // Backend endpoint
        { isVisible: newVisibility }, // Send the new visibility status
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "admin_access_token"
            )}`, // Add token to headers
          },
        }
      );

      // Check response status
      if (response.status === 200) {
        alert(response.data.message);
        handleFetchData();
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
      alert("Failed to update visibility. Please try again.");
    }
  };

  return (
    <div className="">
      {toggleLoading ? (
        <div className="py-6 px-4 md:p-6 max-w-[1180px] mx-auto">
          <div className="md:pl-0 overflow-hidden md:overflow-visible z-10 md:h-auto h-10 top-24 w-full md:w-auto md:flex items-center justify-between pr-2 pb-5">
            <div className="flex items-center space-x-2 text-sm md:text-base">
              <p className="font-bold text-white">
                All News, {FecthData.length} Results
              </p>
              <Link
                to={`/upload`}
                className="focus:outline-none select-none bg-[#14A4E3] text-white font-semibold rounded md:px-2.5 px-2.5 py-1 flex items-center justify-center space-x-1"
              >
                <FaPlusCircle className="text-sm" /> <span>Add</span>
              </Link>
            </div>

            {/* <div className="relative w-[500px]">
          <input
            type="search"
            name="search"
            // value={searchQuery}
            // onChange={handleSearchChange}
            placeholder="Search for news..."
            className="w-full p-2 border rounded-md focus:outline-none text-gray-600"
          />
        </div> */}

            <div
              className={`lg:flex hidden items-center space-x-3 text-xl ${
                FecthData.length > 0 ? "" : "overflow-hidden w-0 h-0"
              }`}
            >
              {startData > 0 ? (
                <button
                  onClick={handlePrev}
                  className="bg-gray-300 md:h-[36px] md:w-[36px] h-[32px] w-[32px] flex items-center justify-center rounded-full text-gray-500 transition-all duration-300 focus:outline-none select-none"
                >
                  <IoIosArrowBack />
                </button>
              ) : (
                <button className="bg-gray-200 md:h-[36px] md:w-[36px] h-[32px] w-[32px] flex items-center justify-center rounded-full text-gray-500 transition-all duration-300 focus:outline-none select-none">
                  <IoIosArrowBack />
                </button>
              )}
              <button className="md:text-base text-sm bg-white focus:outline-none select-none cursor-text md:px-2 px-1.5 py-1 rounded font-semibold">
                {listIndex}
              </button>

              {stopData < FecthData.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="bg-gray-300 md:h-[36px] md:w-[36px] h-[32px] w-[32px] flex items-center justify-center rounded-full text-gray-500 transition-all duration-300 focus:outline-none select-none"
                >
                  <IoIosArrowForward />
                </button>
              ) : (
                <button className="bg-gray-200 md:h-[36px] md:w-[36px] h-[32px] w-[32px] flex items-center justify-center rounded-full text-gray-500 transition-all duration-300 focus:outline-none select-none">
                  <IoIosArrowForward />
                </button>
              )}
            </div>
          </div>

          <div
            className={`py-5 hidden lg:block bg-gray-200 rounded shadow bg-opacity-70 transition-all duration-300 ${
              FecthData.length > 0 ? "" : " overflow-hidden w-0 h-0"
            }`}
          >
            <div>
              <div className="grid grid-cols-7 gap-10 font-bold bg-opacity-60 bg-gray-200 py-1 px-3 text-gray-800 text-sm">
                <h2>#</h2>
                <h2>Photo</h2>
                <h2>Title</h2>
                <h2 className="col col-span-1">Description</h2>
                <h2>Breaking news</h2>
                <h2>CreateAt</h2>
                <h2>Action</h2>
              </div>

              <ul>
                {DataPagenation?.length > 0 &&
                  DataPagenation.map((e, i) => (
                    <li
                      className="py-2 px-3 grid grid-cols-7 gap-10 border-b font-semibold"
                      key={e._id} // Use _id or another unique key from your data
                    >
                      <p className="font-semibold text-base">{i + 1 + index}</p>
                      <div className="w-24 h-14 flex items-center justify-center overflow-hidden">
                        <img
                          className="w-full border"
                          src={`${e.photo}`}
                          alt=""
                        />
                      </div>
                      <p className="flex-wrap capitalize text-base">
                        {e.title}
                      </p>
                      <div className=" col col-span-1">
                        {e.description.length > 29 ? (
                          <p>{e.description.slice(0, 28)}...</p>
                        ) : (
                          e.description
                        )}
                      </div>
                      <div>
                        {e.breakingnews ? (
                          <p className="">True</p>
                        ) : (
                          <p className="">False</p>
                        )}
                      </div>
                      <p>{e.createdAt.split("T")[0]}</p>
                      <div className="relative">
                        {/* Changed the parent from <button> to <div> */}
                        <div className="font-bold text-lg group select-none cursor-pointer">
                          ...
                          <div
                            className={`absolute left-1.5 top-7 bg-white w-24 shadow rounded overflow-hidden transition-all duration-300 z-10 font-semibold text-sm hidden group-hover:block border`}
                          >
                            <div>
                              <Link
                                to={`/details/${e._id}`}
                                className="w-full flex justify-start hover:bg-gray-100 px-2 py-1 items-center space-x-1"
                              >
                                <FaEye className="text-blue-600" />
                                <p>Preiew</p>
                              </Link>
                            </div>

                            <div>
                              <button
                                onClick={() => handleDelete(e._id)}
                                className="w-full flex justify-start hover:bg-gray-100 px-2 py-1 items-center space-x-1"
                              >
                                <MdDelete className="text-red-600" />
                                <p>Delete</p>
                              </button>
                            </div>

                            <div>
                              <Link
                                to={`/edit/${e._id}`}
                                className="w-full flex justify-start hover:bg-gray-100 px-2 py-1 items-center space-x-1"
                              >
                                <RiPencilFill className="text-green-600" />
                                <p>Edit</p>
                              </Link>
                            </div>
                            <div>
                              <button
                                onClick={() =>
                                  handleUpdateVisibility(e._id, e.isVisible)
                                }
                                className="w-full select-none focus:outline-none"
                              >
                                {e.isVisible === 1 ? (
                                  <div className="w-full flex justify-start hover:bg-gray-100 px-2 py-1 items-center space-x-1">
                                    <BiSolidHide className="text-red-600" />
                                    <p>Hide</p>
                                  </div>
                                ) : (
                                  <div className="w-full flex justify-start hover:bg-gray-100 px-2 py-1 items-center space-x-1">
                                    <BiSolidHide className="text-green-600" />
                                    <p>Show</p>
                                  </div>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:hidden sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {FecthData?.length > 0 &&
              FecthData.map((e, i) => (
                <li
                  key={e._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <Link
                    to={`/details/${e._id}`}
                    className="relative focus:outline-none"
                  >
                    <div className="">
                      <img
                        className="w-full h-48 object-cover"
                        src={`${e.photo}`}
                        alt={e.title}
                      />
                    </div>
                    {e.breakingnews===1 && (
                      <div className=" absolute top-0 rounded-bl-lg shadow-lg right-0 bg-orange-600 text-white font-semibold px-2 py-1 capitalize">
                        breaking news
                      </div>
                    )}
                  </Link>

                  <div className="p-4">
                    <div className="mb-2">
                      <Link
                        to={`/details/${e._id}`}
                        className=" focus:outline-none font-semibold truncate capitalize"
                      >
                        {e.title}
                      </Link>
                    </div>
                    <p className="text-gray-700 mt-2 truncate text-wrap">
                      {e.description.length > 100
                        ? `${e.description.slice(0, 140)}...`
                        : e.description}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      {e.createdAt.split("T")[0]}
                    </p>

                    <div className="text-gray-600 mt-2 flex items-center justify-between">
                      <div className="pt-1">
                        <button
                          onClick={() =>
                            handleUpdateVisibility(e._id, e.isVisible)
                          }
                          className="w-full select-none border border-gray-200 shadow focus:outline-none"
                        >
                          {e.isVisible === 1 ? (
                            <div className="w-full flex justify-start bg-gray-100 px-4 py-1 items-center space-x-1">
                              <BiSolidHide className="text-red-600" />
                              <p>Hide</p>
                            </div>
                          ) : (
                            <div className="w-full flex justify-start bg-gray-100 px-4 py-1 items-center space-x-1">
                              <FaEye className="text-green-600" />
                              <p>Show</p>
                            </div>
                          )}
                        </button>
                      </div>

                      <div className="">
                        {e.trending ? <p>Tranding</p> : ""}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <FullPageLoader />
      )}
    </div>
  );
};

export default ManageNews;
