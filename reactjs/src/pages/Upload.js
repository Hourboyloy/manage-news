import React, { useEffect, useState } from "react";
import NewsForm from "../components/NewsForm";

function Upload() {
  const [lengDiscription, setLengDiscription] = useState(0);
  useEffect(() => {
    setLengDiscription(500);
  }, []);

  const handleLength = (getValLeng) => {
    let MaxLeng = 500;
    MaxLeng = MaxLeng - getValLeng;
    setLengDiscription(MaxLeng);
  };

  return (
    <div className="min-h-[91vh] md:p-6 p-4 flex flex-col justify-center">
      <NewsForm lengDiscription={lengDiscription} handleLength={handleLength} />
    </div>
  );
}

export default Upload;
