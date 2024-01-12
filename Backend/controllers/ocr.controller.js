const { createWorker } = require('tesseract.js');
const pdf2img = require('pdf-img-convert');
const pdf = require('pdf-parse');


const fs = require('fs');
const { getCurrentFile } = require('../utils/currentFile');

const extractText = async (req, res) => {

  try {
    const pdfBuffer = fs.readFileSync(getCurrentFile());

    pdf(pdfBuffer).then((data) => {
      console.log(data.text);
    })

    // Convert PDF to images

    // const outputImages = await pdf2img.convert(getCurrentFile());
    //   pdfBuffer, {
    //   width: 800, // Specify the width of the output images
    //   base64: true, // Set to true for base64-encoded image output
    // });

    // console.log(outputImages);

    // Create a zip file containing the images
    // const zip = new JSZip();

    // outputImages.forEach((img, i) => {
    //   zip.file(`output${i}.png`, img);
    // });

    // for (let i = 0; i < outputImages.length; i++)
    //   fs.writeFile("images/output" + i + ".png", outputImages[i], function (error) {
    //     if (error) { console.error("Error: " + error); }
    //   });

    // res.send('success');

    // const worker = await createWorker();

    // const { data } = await worker.recognize(outputImages, { tessjs_create_pdf: '0' });

    // await worker.terminate();

    // console.log("data", data.text);



  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while processing the PDF file.');
  }

  // const worker = await createWorker();

  // const pdfData = fs.readFileSync(getCurrentFile());
  // const { data } = await worker.recognize(pdfData, { tessjs_create_pdf: '1' });

}

module.exports = {
  extractText,
}