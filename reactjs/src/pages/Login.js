import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request starts
    try {
      const response = await axios.post("https://manage-news-server134.vercel.app/login", {
        email,
        password,
      });

      if(response.status===200){
        alert("Login successfuly");
      }
      const { user_access_token, admin_access_token, user } = response.data;
      if (admin_access_token) {
        localStorage.setItem("admin_access_token", admin_access_token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isLogin", "1");
        navigate("/");
      } else if (user_access_token) {
        localStorage.setItem("user_access_token", user_access_token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isLogin", "1");
        navigate("/");
      }
    } catch (error) {
      alert("Login is fialed.Please try again...");
    } finally {
      setLoading(false); // Set loading to false when the request completes
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen sticky z-20 px-5 md:px-0">
      <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-80 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none transition-all duration-500 outline-none focus:border focus:border-blue-500"
              required
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"} // Toggle input type
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className=" w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none transition-all duration-500 outline-none focus:border focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              className="absolute inset-y-0 top-[40%] focus:outline-none right-3 flex items-center text-gray-600 hover:text-gray-800"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-3 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
