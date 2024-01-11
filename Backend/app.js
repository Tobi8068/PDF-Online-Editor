const express = require('express');
const PagesRoutes = require('./routes/pages.routes');
const multer = require('multer');

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

app.use('/pages', PagesRoutes);

// Start the server
app.listen(8081, () => {
  console.log('Server is running on port 8081');
});