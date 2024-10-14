import React from "react";
import { Link } from "react-router-dom";
// import { FaThumbsUp, FaThumbsDown, FaCommentDots } from "react-icons/fa";
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
          <div className="flex items-center mb-3 capitalize">
            <h1 className="font-semibold text-gray-800 pb-1">
              <span className="pr-1 text-lg">Title:</span>
              {data.title === "" ? "Null" : data.title}
            </h1>
          </div>

          <div className="md:flex md:space-x-4 space-y-4 md:space-y-0 md:*:w-6/12">
            <div>
              <div className="overflow-hidden h-64 flex items-center relative">
                <img
                  className="object-cover h-full shadow-md"
                  src={`${data.photo}`}
                  alt=""
                />
                {data.breakingnews === 1 && (
                  <div className="text-sm absolute rounded-br-md left-0 top-0 bg-orange-600 text-white font-semibold px-2 py-1 capitalize">
                    breaking news
                  </div>
                )}
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

            <div className="">
              {data.category !== "" ? (
                <p className="text-sm pb-2.5">
                  <span className="font-semibold">Category:</span>{" "}
                  {data.category}
                </p>
              ) : (
                <p className="text-sm pb-2.5">
                  <span className="">
                    <span className="font-semibold">Category:</span> Null
                  </span>{" "}
                </p>
              )}

              <div className="text-sm">
                <div className=" font-semibold">
                  {data.description !== "" && "Description: "}
                </div>
                {data.description === "" ? (
                  <p>
                    <span className=" font-semibold">Description:</span> Null
                  </p>
                ) : data.description.length <= 260 ? (
                  <p>{data.description}</p>
                ) : (
                  <p className="mb-4">
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

              {data.articleUrl !== "" ? (
                data.articleUrl !== "" && (
                  <div className="pt-2.5">
                    <div className="text-sm font-semibold">Article URL:</div>
                    <p className="text-sm w-full max-w-[320px] md:max-w-[320px] lg:max-w-full overflow-x-auto custom-scroll pb-0.5">
                      <a
                        href={data.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-blue-500 whitespace-nowrap hover:text-blue-700 transition-all duration-300"
                      >
                        {data.articleUrl}
                      </a>
                    </p>
                  </div>
                )
              ) : (
                <div className="pt-2.5">
                  <div className="text-sm font-semibold">Article URL: Null</div>
                </div>
              )}

              <div className="text-sm space-y-0.5">
                <div className="">
                  {data.trending ? (
                    <p className="pt-3 font-semibold">Tranding</p>
                  ) : (
                    <p className="pt-3">
                      <span className=" font-semibold">Tranding:</span> Null
                    </p>
                  )}
                </div>
              </div>

              <div className="flex md:flex-row flex-col space-y-3 md:space-y-0 md:justify-between md:items-center text-sm pt-3">
                <div>
                  <span className=" font-semibold ">Created At:</span>{" "}
                  {new Date(data.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Updated At:</span>{" "}
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
