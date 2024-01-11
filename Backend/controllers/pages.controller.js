const { getCurrentFile } = require('../utils/currentFile');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

const addPages = async (req, res) => {
  console.log('addpage');
  try {
    console.log(getCurrentFile(), "123123");
    const uint8Array = fs.readFileSync(getCurrentFile());
    console.log(uint8Array);
    const pdfDoc = await PDFDocument.load(uint8Array);

    const pageNumbers = req.body.addNumber;
    console.log(pageNumbers);

    for (let i = 0; i < pageNumbers; i++) {
      pdfDoc.addPage([500, 700]);
    }

    const pdfBytes = await pdfDoc.save();

    const filePath = 'save/save.pdf';

    fs.writeFileSync(filePath, pdfBytes, (err) => {
      if (err) {
        console.error('Error while saving the file:', err);
      } else {
        console.log('The file has been saved successfully.');
      }
    })
    res.send("Save");

    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename=modified.pdf');
    // res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
}

const deletePages = async (req, res) => {
  try {
    const uint8Array = fs.readFileSync(getCurrentFile());
    console.log(uint8Array);
    const pdfDoc = await PDFDocument.load(uint8Array);

    const pageNumbers = req.body.pageNumbers.split(',').map(Number);

    pageNumbers.sort((a, b) => a - b);

    let numDeletedPages = 0;
    for (const pageNum of pageNumbers) {
      pdfDoc.removePage(pageNum - 1 - numDeletedPages);
      numDeletedPages++;
    }

    const pdfBytes = await pdfDoc.save();

    const filePath = 'save/save.pdf';

    fs.writeFileSync(filePath, pdfBytes, (err) => {
      if (err) {
        console.error('Error while saving the file:', err);
      } else {
        console.log('The file has been saved successfully.');
      }
    })
    res.send("Save");

    // res.setHeader('Content- mbType', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename=modified.pdf');
    // res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
}
const reorderPages = async (req, res) => {

}

module.exports = {
  addPages,
  deletePages,
  reorderPages,
}