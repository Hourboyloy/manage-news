import React, { useEffect, useState } from 'react'
import EditForm from "../components/EditForm";
import { useParams } from "react-router-dom";


function Edit() {
  const { id } = useParams();
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
    <div>
      <EditForm
        id={id}
        handleLength={handleLength}
        lengDiscription={lengDiscription}
      />
    </div>
  );
}

export default Edit
