import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import ControlPanel from './ControlPanel';
import '../css/pdfeditor.css'

const PDFReader = () => {
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const serverId = useSelector(state => state.serverId);

  console.log(serverId, "123123");

  // let pdf = null;

  useEffect(() => {
    window.PDFAnnotate("pdf-container", '1.pdf', {
      onPageUpdated(page, oldData, newData) {
        console.log(page, oldData, newData);
      },
      ready() {
        console.log("Plugin initialized successfully");
      },
      scale: scale,
      pageNum: pageNumber,
      pageImageCompression: "SLOW", // FAST, MEDIUM, SLOW(Helps to control the new PDF file size)
    });
  }, [scale, pageNumber]);
  
  return (
    <div>
      <section
        id="pdf-section"
        className="d-flex flex-column align-items-center w-100"
      >
        <ControlPanel
          scale={scale}
          setScale={setScale}
          numPages={numPages}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          file="1.pdf"
        />
        <div id="pdf-container"></div>
      </section>
    </div>
  );
};

export default PDFReader;
