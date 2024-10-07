import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { IsLoggedIn } from "./Auth/Auth";
import { Setbg } from "./components/backgroundStore";

function App() {
  const [background, setBackground] = useState(null);
  const [togglenav, setTogglenav] = useState(false);
  const navigate = useNavigate();

  const handleSetLogin = () => {
    localStorage.setItem("isLogin", "0");
    localStorage.setItem("admin_access_token", "");
    localStorage.setItem("user", JSON.stringify({}));
  };

  const setDefaultIndexofList = () => {
    localStorage.setItem("startData", JSON.stringify(0));
    localStorage.setItem("stopData", JSON.stringify(9));
    localStorage.setItem("index", JSON.stringify(0));
    localStorage.setItem("listIndex", JSON.stringify(1));
  };

  useEffect(() => {
    axios
      .get("https://manage-news-server134.vercel.app/background-seted")
      .then((response) => {
        if (
          response.status === 200 &&
          response.data.message !== "No document with seted=true found"
        ) {
          setBackground(response.data.seted);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    if (IsLoggedIn() !== "1") {
      navigate("/login");
    }
  }, [navigate]);

  if (IsLoggedIn() !== "1") {
    return <div>Redirecting...</div>;
  }

 const expiresIn = localStorage.getItem("expiresin");
 if (expiresIn && Date.now() >= Number(expiresIn)) {
   localStorage.setItem("isLogin", "0");
   navigate("/login");
   return <div>Session expired, logging out...</div>; // Exit early
 }

  const handleToggle = () => {
    setTogglenav(!togglenav);
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile Navigation */}
      <div
        className={`h-[120vh] md:w-6/12 w-7/12 bg-gray-900 bg-opacity-90 fixed xl:hidden top-0 text-white z-30 pt-4 transition-all duration-500 ${
          togglenav ? "left-0" : "-left-full"
        }`}
      >
        <div className="text-xl font-bold text-white px-4">My Dashboard</div>
        <nav className="space-y-4 px-[1px] pt-8 font-semibold md:text-lg *:border-b *:border-gray-500">
          <Link
            onClick={() => {
              handleToggle();
              setDefaultIndexofList();
            }}
            to="/"
            className="focus:outline-none select-none block py-2 px-4 hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link
            onClick={() => {
              handleToggle();
              setDefaultIndexofList();
            }}
            to="/news"
            className="focus:outline-none select-none block py-2 px-4 rounded hover:bg-gray-700"
          >
            News
          </Link>
          <Link
            onClick={() => {
              handleToggle();
              setDefaultIndexofList();
            }}
            to="/background"
            className="focus:outline-none select-none block py-2 px-4 rounded hover:bg-gray-700"
          >
            Background
          </Link>
          <Link
            to="/login"
            onClick={() => {
              handleSetLogin();
              setDefaultIndexofList();
            }}
            className="focus:outline-none select-none block py-2 px-4 rounded hover:bg-gray-700"
          >
            Logout
          </Link>
        </nav>
      </div>

      {/* Background Section */}
      {Setbg() ? (
        <div
          style={{
            backgroundImage: `url(${Setbg()})`,
          }}
          className="bg-cover bg-center object-cover object-center h-full fixed top-0 left-0 w-full"
        >
          <div className="fixed w-full inset-0 top-0 left-0 bg-opacity-55 bg-gray-800"></div>
        </div>
      ) : (
        <div
          style={{
            backgroundImage: `url(${background?.bgurl})`,
          }}
          className="bg-cover bg-center object-cover object-center h-full fixed top-0 left-0 w-full"
        >
          <div className="fixed w-full inset-0 top-0 left-0 bg-opacity-55 bg-gray-800"></div>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <div className="hidden xl:block sticky top-0 left-0 h-full">
        <Sidebar
          setDefaultIndexofList={setDefaultIndexofList}
          handleSetLogin={handleSetLogin}
        />
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <Header handleToggle={handleToggle} togglenav={togglenav} />
        <main className="z-10 sticky">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
