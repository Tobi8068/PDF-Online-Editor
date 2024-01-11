// npm install react-filepond filepond --save
import React, { useState } from "react";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "../../node_modules/filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
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

// Register the plugins
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

// Our app
export function FilePondComponent() {
  
  const [files, setFiles] = useState([]);
  let pond = null;

  const onSubmit = () => {
    console.log("pond", pond);

    if (pond) {
      const files = pond.getFiles();
      files.forEach((file) => {
        console.log("each file", file, file.getFileEncodeBase64String());
      });
      pond
        .processFiles(files)
        .then(
          (res) => {
            console.log(res[0].serverId);
            window.location.assign("/editor")
          })
        .catch((error) => console.log("err", error));
    }
  };

  return (
    <div className="App">
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
        server="http://localhost:3000/upload"
        name="files"
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />

      <Button className="text-center" onClick={onSubmit}>Submit</Button>
    </div>
  );
};
