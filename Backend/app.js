const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser')
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const html2pdf = require('html-pdf');
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');
const pdfkit = require('pdfkit');
const sizeOf = require('image-size');

const app = express();
const { setCurrentFile, getCurrentFile } = require('./utils/currentFile');

// Set up the storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination folder for uploads
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Get the file extension
    const currentFileName = file.fieldname + '-' + Date.now() + ext;
    cb(null, currentFileName); // Rename the file with original extension
    console.log(currentFileName);
    setCurrentFile("uploads/" + currentFileName);
  }
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Handle POST requests to /upload_word
app.post('/upload_word', [upload.single('file')], (req, res) => {
  // Convert Word document to HTML
  mammoth.convertToHtml({ path: getCurrentFile() })
    .then(function (result) {
      const html = result.value;

      // Convert HTML to PDF
      html2pdf.create(html, { format: 'Letter' }).toFile('uploads/word2pdf.pdf', function (err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: 'output.pdf' }
      });
    })
    .catch(function (err) {
      console.log(err);
    });
  res.send('success');
});
// Handle GET requests to /download_word
app.get('/download_word', function (req, res) {
  const filePath = path.join(__dirname, 'uploads', 'word2pdf.pdf');
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Length': stat.size,
    'Content-Disposition': 'attachment; filename=example.pdf',
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

async function generateHtmlFromWorkbook(workbook) {
  let htmlContent = '<html><body>';

  // Iterate through each worksheet in the workbook
  workbook.eachSheet((worksheet, sheetId) => {
    // Start a new HTML table for each worksheet
    htmlContent += `<table border="1"><caption>${worksheet.name}</caption><tbody>`;

    // Iterate through each row in the worksheet
    worksheet.eachRow((row, rowNumber) => {
      htmlContent += '<tr>';
      // Iterate through each cell in the row
      row.eachCell((cell, colNumber) => {
        htmlContent += `<td>${cell.value}</td>`;
      });
      htmlContent += '</tr>';
    });

    htmlContent += '</tbody></table>';
  });

  htmlContent += '</body></html>';

  return htmlContent;
}

// Handle POST requests to /upload_excel
app.post('/upload_excel', [upload.single('file')], async function (req, res) {
  // Load an existing workbook
  const workbook = new ExcelJS.Workbook();
  workbook.xlsx.readFile(getCurrentFile())
    .then(async function () {
      // Convert the workbook to HTML
      const htmlContent = await generateHtmlFromWorkbook(workbook);

      // Use puppeteer to convert the HTML to PDF
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(htmlContent);
      await page.pdf({ path: 'uploads/excel2pdf.pdf', format: 'A4' });

      await browser.close();
      console.log('PDF file created');
    })
    .catch(function (error) {
      console.error('Error:', error);
    });
  res.send('success');
})

// Handle GET requests to /download_excel
app.get('/download_excel', function (req, res) {
  const filePath = path.join(__dirname, 'uploads', 'excel2pdf.pdf');
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Length': stat.size,
    'Content-Disposition': 'attachment; filename=example.pdf',
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

// Handle POST requests to /upload_image
app.post('/upload_image', [upload.single('file')], async function (req, res) {
  const imageDimensions = sizeOf(getCurrentFile());
  const pdfDoc = new pdfkit({ size: [imageDimensions.width, imageDimensions.height] });
  const writeStream = fs.createWriteStream('uploads/image2pdf.pdf');
  pdfDoc.pipe(writeStream);

  pdfDoc.image(getCurrentFile(), 0, 0, { width: imageDimensions.width, height: imageDimensions.height });
  
  pdfDoc.end();
  writeStream.on('finish', function () {
    console.log('PDF file created');
  });
  res.send('success');
})

// Handle GET requests to /download_image
app.get('/download_image', function (req, res) {
  const filePath = path.join(__dirname, 'uploads', 'image2pdf.pdf');
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Length': stat.size,
    'Content-Disposition': 'attachment; filename=example.pdf',
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

// Start the server
app.listen(8081, () => {
  console.log('Server is running on port 8081');
});