// src/components/Sidebar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ handleSetLogin, setDefaultIndexofList }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`bg-gray-900 bg-opacity-80 text-white min-h-[99.8vh] overflow-hidden ${
        isOpen ? "w-64" : "w-20"
      } transition-width duration-300`}
    >
      <div className="flex justify-between items-center p-4">
        <h1 className={`${isOpen ? "block" : "hidden"} text-xl font-bold`}>
          Dashboard
        </h1>
        <button
          onClick={toggleSidebar}
          className="focus:outline-none select-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
      <nav className="space-y-4 p-4">
        <Link
          onClick={setDefaultIndexofList}
          to="/"
          className="block py-2 px-4 rounded hover:bg-gray-700"
        >
          Dashboard
        </Link>
        <Link
          onClick={setDefaultIndexofList}
          to="/news"
          className="block py-2 px-4 rounded hover:bg-gray-700"
        >
          News
        </Link>

        <Link
          onClick={setDefaultIndexofList}
          to="/background"
          className="block py-2 px-4 rounded hover:bg-gray-700"
        >
          Background
        </Link>

        <Link
          to="/login"
          onClick={() => {
            setDefaultIndexofList();
            handleSetLogin();
          }}
          className="block py-2 px-4 rounded hover:bg-gray-700"
        >
          Logout
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
