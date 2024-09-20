import React from "react";
import { Link } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown, FaCommentDots } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { IoPencil } from "react-icons/io5";

const NewsDetail = ({ data, isExpanded, toggleExpanded, handleDelete, id }) => {
  if (data == null) {
    return;
  }

  return (
    <div className="py-8 flex flex-col justify-center w-full">
      <div className="w-[92%] md:w-full mx-auto md:mx-0 md:px-6">
        <div className="md:max-w-[900px] overflow-hidden md:mx-auto md:p-6 p-4 bg-white bg-opacity-80 shadow-lg rounded-lg">
          {/* Title and Logo */}
          <div className="flex items-center space-x-4 mb-5">
            <img
              src={`${data.logo}`}
              alt={`${data.title} Logo`}
              className="w-11 h-11 rounded-full object-cover"
            />
            <h1 className="text-2xl font-bold text-gray-800 pb-1">
              {data.title}
            </h1>
          </div>

          <div className="md:flex md:space-x-4 space-y-4 md:space-y-0 md:*:w-6/12">
            <div>
              <div className="overflow-hidden h-64 flex items-center">
                <img
                  className="object-cover h-full shadow-md"
                  src={`${data.photo}`}
                  alt=""
                />
              </div>

              <div className="mt-5 space-x-4 flex items-center font-semibold select-none">
                <Link className="focus:outline-none" to="/news">
                  <button className="focus:outline-none bg-[#2563EB] text-white py-2 px-4 rounded hover:bg-blue-700 transition-all flex items-center space-x-1">
                    <FaArrowLeft />
                    <p>Back</p>
                  </button>
                </Link>

                <button
                  onClick={handleDelete}
                  className="focus:outline-none bg-[#DC2626] text-white py-2 px-4 rounded hover:bg-red-700 transition-all flex items-center space-x-0.5"
                >
                  <MdDelete />
                  <p>Delete</p>
                </button>

                <Link
                  to={`/edit/${id}`}
                  className="focus:outline-none bg-[#16A34A] text-white py-2 px-4 rounded hover:bg-green-700 transition-all flex items-center space-x-0.5"
                >
                  <IoPencil className="" />
                  <p>Edit</p>
                </Link>
              </div>
            </div>

            <div>
              <div>
                {data.description.length <= 260 ? (
                  <p>{data.description}</p>
                ) : (
                  <p className="text-gray-700 mb-4">
                    {isExpanded
                      ? data.description
                      : `${data.description.slice(0, 260)}...`}
                    <span
                      className="text-sm font-semibold cursor-pointer text-blue-600"
                      onClick={toggleExpanded}
                    >
                      {isExpanded ? "See Less" : "See More"}
                    </span>
                  </p>
                )}
              </div>

              <div className="text-gray-600 mb-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-nowrap">
                    <FaThumbsUp className="text-blue-600" />
                    <p className="flex items-center">
                      <span>{data.likes}</span>{" "}
                      <span className=" lg:block hidden">Likes</span>{" "}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-nowrap">
                    <FaThumbsDown className="text-red-600" />
                    <p className="flex items-center">
                      <span>{data.noLikes}</span>
                      <span className="lg:block hidden">Dislikes</span>{" "}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-nowrap">
                    <FaCommentDots className="text-green-600" />
                    <p className="flex items-center">
                      <span>{data.commant}</span>
                      <span className="lg:block hidden">Comments</span>{" "}
                    </p>
                  </div>
                </div>
                <div className="">{data.trending ? <p>Tranding</p> : ""}</div>
              </div>

              <div className="flex md:flex-row flex-col space-y-3 md:space-y-0 md:justify-between md:items-center text-gray-500 text-sm">
                <div>
                  <strong>Created At:</strong>{" "}
                  {new Date(data.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Updated At:</strong>{" "}
                  {new Date(data.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
