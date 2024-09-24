import React from "react";
import { Outlet } from "react-router-dom";
import { Setbg } from "./components/backgroundStore";

const AuthLayout = () => {
  return (
    <div>
      {Setbg() === null ? (
        <div
          style={{
            backgroundImage: `url(${background?.bgurl})`,
          }}
          className="bg-cover bg-center object-cover object-center h-full fixed top-0 left-0 w-full"
        >
          <div className="fixed w-full inset-0 top-0 left-0 bg-opacity-55 bg-gray-800"></div>
        </div>
      ) : (
        <div
          style={{
            backgroundImage: `url(${Setbg()})`,
          }}
          className="bg-cover bg-center object-cover object-center h-full fixed top-0 left-0 w-full"
        >
          <div className="fixed w-full inset-0 top-0 left-0 bg-opacity-55 bg-gray-800"></div>
        </div>
      )}

      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
