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
import { FaThumbsUp, FaThumbsDown, FaCommentDots } from "react-icons/fa";

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
      const response = await axios.get(
        "https://manage-news-server134.vercel.app/get-all"
      );
      setFecthData(response.data.news);
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
  const [message, setMessage] = useState("");
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
        setMessage("News item deleted successfully.");
        alert(message);
        handleFetchData();
      } else {
        setMessage("Failed to delete the news item.");
        alert(message);
      }
    } catch (error) {
      setMessage("Error deleting the item. Please try again.");
      alert(message);
    }
  };

  return (
    <div className="">
      {toggleLoading ? (
        <div className="py-6 px-4 md:p-6 max-w-[1180px] mx-auto">
          <div className=" sticky md:static left-0 md:pl-0 overflow-hidden md:overflow-visible z-10 md:h-auto h-10 top-24 w-full md:w-auto md:flex items-center justify-between pr-2 pb-5">
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
              className={`md:flex hidden items-center space-x-3 text-xl ${
                FecthData.length > 0 ? "" : "hidden"
              }`}
            >
              {startData > 0 ? (
                <button
                  onClick={handlePrev}
                  className="bg-gray-300 md:h-[36px] md:w-[36px] h-[32px] w-[32px] flex items-center justify-center rounded-full text-gray-500 transition-all duration-300"
                >
                  <IoIosArrowBack />
                </button>
              ) : (
                <button className="bg-gray-200 md:h-[36px] md:w-[36px] h-[32px] w-[32px] flex items-center justify-center rounded-full text-gray-500 transition-all duration-300">
                  <IoIosArrowBack />
                </button>
              )}
              <button className="md:text-base text-sm bg-white focus:outline-none select-none cursor-text md:px-2 px-1.5 py-1 rounded font-semibold">
                {listIndex}
              </button>

              {stopData < FecthData.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="bg-gray-300 md:h-[36px] md:w-[36px] h-[32px] w-[32px] flex items-center justify-center rounded-full text-gray-500 transition-all duration-300"
                >
                  <IoIosArrowForward />
                </button>
              ) : (
                <button className="bg-gray-200 md:h-[36px] md:w-[36px] h-[32px] w-[32px] flex items-center justify-center rounded-full text-gray-500 transition-all duration-300">
                  <IoIosArrowForward />
                </button>
              )}
            </div>
          </div>

          <div
            className={`py-5 hidden md:block bg-gray-200 rounded shadow bg-opacity-70 transition-all duration-300 ${
              FecthData.length > 0 ? "" : "hidden"
            }`}
          >
            <div>
              <div className="grid grid-cols-7 gap-10 font-bold bg-opacity-60 bg-gray-200 py-1 px-3 text-gray-800 text-sm">
                <h2>#</h2>
                <h2>Photo</h2>
                <h2>Logo</h2>
                <h2>Title</h2>
                <h2 className="col col-span-1">Description</h2>
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
                      <div className="w-24 h-14 flex items-center justify-center overflow-hidden">
                        <img
                          className="w-full border"
                          src={`${e.logo}`}
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
                                <p>View</p>
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
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:hidden sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {FecthData?.length > 0 &&
              FecthData.map((e, i) => (
                <Link
                  to={`/details/${e._id}`}
                  key={e._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative">
                    <img
                      className="w-full h-48 object-cover"
                      src={`${e.photo}`}
                      alt={e.title}
                    />
                    <div className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1 shadow-lg cursor-pointer group">
                      <div className="hidden group-hover:flex flex-col absolute right-0 top-full bg-white border rounded-lg shadow-lg w-36">
                        <Link
                          to={`/details/${e._id}`}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 text-blue-600"
                        >
                          <FaEye className="mr-2" />
                          <p>View</p>
                        </Link>
                        <button
                          onClick={() => handleDelete(e._id)}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 text-red-600"
                        >
                          <MdDelete className="mr-2" />
                          <p>Delete</p>
                        </button>
                        <Link
                          to={`/edit/${e._id}`}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 text-green-600"
                        >
                          <RiPencilFill className="mr-2" />
                          <p>Edit</p>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden mr-3 text">
                        <img
                          className="w-full h-full object-cover border"
                          src={`${e.logo}`}
                          alt="Logo"
                        />
                      </div>
                      <h3 className=" font-semibold truncate capitalize">
                        {e.title}
                      </h3>
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
                      <div className="flex items-center space-x-4">
                        <div>
                          {e.likes < 1000 ? (
                            <div className="flex items-center space-x-2 text-nowrap">
                              <FaThumbsUp className="text-blue-600" />
                              <p className="flex items-center">
                                <span>{e.likes}</span>{" "}
                                <span className=" lg:block hidden">Likes</span>{" "}
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 text-nowrap">
                              <FaThumbsUp className="text-blue-600" />
                              <p className="flex items-center">
                                <span>{(e.likes / 1000).toFixed(1)}</span>{" "}
                                <span className=" lg:block hidden">Likes</span>{" "}
                              </p>
                            </div>
                          )}
                        </div>

                        <div>
                          {e.noLikes < 1000 ? (
                            <div className="flex items-center space-x-2 text-nowrap">
                              <FaThumbsDown className="text-red-600" />
                              <p className="flex items-center">
                                <span>{e.noLikes}</span>
                                <span className="lg:block hidden">
                                  Dislikes
                                </span>{" "}
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 text-nowrap">
                              <FaThumbsDown className="text-red-600" />
                              <p className="flex items-center">
                                <span>{(e.noLikes / 1000).toFixed(1)}</span>
                                <span className="lg:block hidden">
                                  Dislikes
                                </span>{" "}
                              </p>
                            </div>
                          )}
                        </div>

                        <div>
                          {e.commant < 1000 ? (
                            <div className="flex items-center space-x-2 text-nowrap">
                              <FaCommentDots className="text-green-600" />
                              <p className="flex items-center">
                                <span>{e.commant}</span>
                                <span className="lg:block hidden">
                                  Comments
                                </span>{" "}
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 text-nowrap">
                              <FaCommentDots className="text-green-600" />
                              <p className="flex items-center">
                                <span>{(e.commant / 1000).toFixed(1)}</span>
                                <span className="lg:block hidden">
                                  Comments
                                </span>{" "}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="">
                        {e.trending ? <p>Tranding</p> : ""}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      ) : (
        <FullPageLoader />
      )}
    </div>
  );
};

export default ManageNews;
