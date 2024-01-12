// -------------------- Pdf Viewer --------------------//

import React, { useState, useEffect } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import ControlPanel from './ControlPanel';
import '../css/pdfeditor.css'
import {
  Box,
  Container,
  ChakraProvider
} from "@chakra-ui/react";

// -------------------- File Upload --------------------//
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "../../node_modules/filepond/dist/filepond.min.css";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "../../node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";

import { Button } from "@chakra-ui/react";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageResize,
  FilePondPluginImageCrop,
  FilePondPluginImageTransform
);

const PDFReader = () => {

  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showDiv, setShowDiv] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [serverId, setServerId] = useState('JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
  'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
  'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
  'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
  'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
  'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
  'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
  'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
  'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
  'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
  'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
  'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');
  const [files, setFiles] = useState([]);
  let pond = null;

  const toggleDiv = () => {
    setShowDiv(!showDiv);
  };

  useEffect(() => {
    window.PDFAnnotate("pdf-container", serverId, {
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
  }, [scale, pageNumber, serverId]);
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    // Add event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const onSubmit = () => {
    console.log("pond", pond);

    if (pond) {
      const files = pond.getFiles();
      files.forEach((file) => {
        console.log("each file", file, "file",  file.getFileEncodeBase64String());
      });
      pond
        .processFiles(files)
        .then(
          (res) => {
            toggleDiv();
            let data = res[0].serverId;
            let base64Data = data.split(",")[1];
            setServerId(base64Data);
            console.log(base64Data);
            console.log('test');
          })
        .catch((error) => console.log("err", error));
    }
  };
  const scrollPositionStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'rgb(245, 247, 249)', // Set background color as needed
    padding: '10px',
    zIndex: 999 // Ensure it's on top of other content
  };
  return (
    <>
    <div>
    <ChakraProvider>
      {showDiv && <div className='openbox'>
    <Container>
      <Box>
      <div>
          <FilePond
            files={files}
            ref={(ref) => {
              pond = ref;
            }}
            required
            acceptedFileTypes={["application/pdf"]}
            fileValidateTypeDetectType={(source, type) =>
              // Note: we need this here to activate the file type validations and filtering
              new Promise((resolve, reject) => {
                // Do custom type detection here and return with promise
                resolve(type);
              })
            }
            allowFileEncode
            allowImageTransform
            imagePreviewHeight={400}
            imageCropAspectRatio={"1:1"}
            imageResizeTargetWidth={100}
            imageResizeTargetHeight={100}
            imageResizeMode={"cover"}
            imageTransformOutputQuality={50}
            imageTransformOutputQualityMode="optional"
            imageTransformBeforeCreateBlob={(canvas) =>
              new Promise((resolve) => {
                // Do something with the canvas, like drawing some text on it
                const ctx = canvas.getContext("2d");
                ctx.font = "48px serif";
                ctx.fillText("Hello world", 10, 50);
                console.log("imageTransformBeforeCreateBlob", ctx, canvas);
                // return canvas to the plugin for further processing
                resolve(canvas);
              })
            }
            imageTransformAfterCreateBlob={(blob) =>
              new Promise((resolve) => {
                // do something with the blob, for instance send it to a custom compression alogrithm
                console.log("imageTransformAfterCreateBlob", blob);
                // return the blob to the plugin for further processing
                resolve(blob);
              })
            }
            onupdatefiles={setFiles}
            instantUpload={false}
            allowMultiple={false}
            maxFiles={1}
            server="http://localhost:8081/upload"
            name="files"
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
          <Button className="text-center" onClick={onSubmit}>Upload</Button>
        </div>
      </Box>
    </Container>
  </div>}
  </ChakraProvider>
    </div>
            <ControlPanel
          scale={scale}
          setScale={setScale}
          numPages={numPages}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          file="1.pdf"
        />
<div className='left-bar py-5'>
  <div className='mt-3'></div>
  <div onClick={toggleDiv}><i class="far far fa-file fa-lg"></i></div>
  <div style={{position:'absolute', bottom:'40px', left:'20px'}}>
  <div className='mt-3'><i class="fas fa-gear fa-lg"></i></div>
  <div className='mt-3'><i class="fas fa-info fa-lg"></i></div>
  </div>
</div>
<div style={{ backgroundColor: 'rgb(225, 225, 225)', minHeight: '100vh'}}>
<section
        id="pdf-section"
        className="d-flex mt-4 flex-column align-items-center w-100">
        <div id="pdf-container" style={{ maxHeight: '100%', overflow: 'auto' }}></div>
      </section>
    
      {/* <div style={scrollPositionStyle}>
    <p>Vertical scroll position: {scrollPosition}</p>
  </div> */}
    </div>

    </>
  );
};

export default PDFReader;
