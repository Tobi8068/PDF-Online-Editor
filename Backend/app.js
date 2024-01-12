const express = require('express');
const PagesRoutes = require('./routes/pages.routes');
const OCRRoutes = require('./routes/ocr.routes');
const multer = require('multer');
const { createWorker } = require('tesseract.js');

const { setCurrentFile } = require('./utils/currentFile');

const fs = require('fs');

const upload = multer({ dest: 'uploads/' }); // Set the destination for uploaded files

const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());

// Handle POST requests to /upload
app.post('/upload', upload.array("files"), (req, res) => {
  console.log(req.files[0].originalname, req.files[0].filename);
  let oldPath = "uploads/" + req.files[0].filename;
  let newPath = "uploads/" + req.files[0].filename + ".pdf";

  setCurrentFile(newPath);

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error('Error renaming file:', err);
      res.status(500).send('Error renaming file');
    }
    else {
      console.log('File renamed successfully');

      const pdfFilePath = 'uploads/' + req.files[0].filename + ".pdf";
      const pdfFileData = fs.readFileSync(pdfFilePath);
      const base64Data = pdfFileData.toString('base64');
      const dataUri = `data:application/pdf;base64,${base64Data}`;
      res.json({ dataUri });
    }
  });
});

// Handle POST requests to /upload images
app.post('/upload_image', upload.array("files"), async (req, res) => {
  // console.log(req.files[0].originalname, req.files[0].filename);
  // let oldPath = "uploads/" + req.files[0].filename;
  // let newPath = "uploads/" + req.files[0].filename;

  // setCurrentFile(newPath);

  // fs.rename(oldPath, newPath, async (err) => {
  //   if (err) {
  //     console.error('Error renaming file:', err);
  //     res.status(500).send('Error renaming file');
  //   }
  //   else {
  //     console.log('File renamed successfully');

      // const imageFilePath = 'uploads/' + req.files[0].filename;
      const imageFilePath = 'uploads/1.png';
      const worker = await createWorker();

      const { data } = await worker.recognize(imageFilePath, { tessjs_create_pdf: '0' });

      await worker.terminate();

      console.log("data", data.text);

      res.send('success');
  //   }
  // });
});

app.use('/pages', PagesRoutes);
app.use('/ocr', OCRRoutes);

// Start the server
app.listen(8081, () => {
  console.log('Server is running on port 8081');
});