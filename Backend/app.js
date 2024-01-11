const express = require('express');
const multer  = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' }); // Set the destination for uploaded files

const bodyParser = require('body-parser')
// const upload = multer({ dest: 'uploads/' }); // Set the destination for uploaded files
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
  let newPath = "uploads/" + req.files[0].filename +".pdf";

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
      const str = String(base64Data)
      const dataUri = `data:application/pdf; base64, ${str}`;
      res.send(dataUri);
    }
  });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});