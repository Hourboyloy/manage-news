import React from "react";
import { Outlet } from "react-router-dom";
import { Setbg } from "./components/backgroundStore";
import axios from 'axios';

const AuthLayout = () => {
  const [background, setBackground] = useState();
  useEffect(() => {
    axios
      .get("https://manage-news-server134.vercel.app/background-seted")
      .then((response) => {
        if (
          response.status === 200 &&
          response.data.message !== "No document with seted=true found"
        ) {
          return setBackground(response.data.seted);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
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
