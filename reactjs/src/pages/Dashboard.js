import React from "react";

const Dashboard = () => {
  // useEffect(()=>{localStorage.removeItem("background");},[])
  return (
    <div className=" w-full h-[90vh] bg-center bg-no-repeat bg-cover relative">
      {/* <div className=" pt-5 text-center">
        <h1 className=" font-bold text-4xl text-white">Wellcome to Dashboard</h1>
      </div> */}
      <div className="p-6 text-white">
        <h2 className="text-3xl font-semibold">Welcome to My Dashboard</h2>
        <p className="mt-4">
          The "News" section on the homepage of the admin dashboard is designed
          to provide administrators with an efficient way to manage and update
          news content for their platform. This section serves as the central
          hub for news management, allowing administrators to easily view, edit,
          and organize news articles.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
