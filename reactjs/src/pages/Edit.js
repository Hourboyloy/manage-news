import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import EditForm from "../components/EditForm";
import { useParams } from "react-router-dom";
import FullPageLoader from "../components/FullPageLoader";

function Edit() {
  const { id } = useParams();
  const [lengDiscription, setLengDiscription] = useState(0);
  const [isfound, setfound] = useState(true);
  const [isloading, setLoading] = useState(true);
  const [data, setData] = useState();
  console.log(data);

  useEffect(() => {
    setLengDiscription(400);
  }, []);

  const handleGetbyID = useCallback(async () => {
    try {
      const res = await axios.get(`https://manage-news-server134.vercel.app/getone/${id}`);
      if (res.status === 200) {
        setLoading(false);
        if (res.data.message === "News not found") {
          setfound(false);
        } else {
          setData(res.data.news);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  useEffect(() => {
    handleGetbyID();
  }, [handleGetbyID]);

  const handleLength = (getValLeng) => {
    let MaxLeng = 400;
    MaxLeng = MaxLeng - getValLeng;
    setLengDiscription(MaxLeng);
  };

  return (
    <div>
      {isloading ? (
        <FullPageLoader />
      ) : isfound ? (
        <EditForm
          id={id}
          handleLength={handleLength}
          lengDiscription={lengDiscription}
          news={data}
        />
      ) : (
        <div className="xl:text-4xl lg:text-3xl md:text-2xl text-xl text-white font-bold h-[90vh] flex justify-center items-center">
          Not Found
        </div>
      )}
    </div>
  );
}

export default Edit;
