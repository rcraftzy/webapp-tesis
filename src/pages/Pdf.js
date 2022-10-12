import React, { useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import OrdenPdf from "../pdf/Orden";

function Pdf () {

  const [poema, setPoema] = useState("");
  const verPDF = true;

  function fetchPoema() {
    fetch("https://www.poemist.com/api/v1/randompoems")
      .then((response) => response.json())
      .then((data) => {
        setPoema(data[0]);
      });
  }
    useEffect(() => {
    fetchPoema()
  }, []);
  return(
    <div style={{ height: "100vh"}}> 
      {poema ? (
        <>
        {verPDF ? (
          <PDFViewer style={{ width: "100%", height: "100vh"}}>
            <OrdenPdf poema={poema} />
          </PDFViewer>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
export default Pdf;
