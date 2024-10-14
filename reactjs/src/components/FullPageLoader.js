import React, { useState, useEffect } from "react";

const FullPageLoader = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    },200); // Delay of 300ms

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  if (!isVisible) {
    return null; // Return null to avoid rendering the loader immediately
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gray-100">
      <div className="flex flex-col items-center">
        {/* Loading Spinner */}
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 mb-4"></div>
        {/* Loading Text */}
        <p className="text-gray-600 text-xl font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default FullPageLoader;
