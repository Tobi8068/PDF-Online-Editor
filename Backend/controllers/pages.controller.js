const { getCurrentFile } = require('../utils/currentFile');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const { sendData } = require('../utils/currentFile');

const addPages = async (req, res) => {
  console.log('addpage');
  try {
    console.log(getCurrentFile(), "123123");
    const uint8Array = fs.readFileSync(getCurrentFile());
    console.log(uint8Array);
    const pdfDoc = await PDFDocument.load(uint8Array);

    const firstPage = pdfDoc.getPage(0);
    const {width, height} = firstPage.getSize();
    console.log(width, ":", height);

    const pageNumbers = req.body.addNumber;
    const pageIndex = req.body.pageIndex;
    console.log(pageIndex, pageNumbers, "qweqwe");

    for (let i = 0; i < pageNumbers; i++) {
      pdfDoc.insertPage(parseInt(pageIndex), [width, height]);
    }

    const pdfBytes = await pdfDoc.save();

    const filePath = getCurrentFile();

    fs.writeFileSync(filePath, pdfBytes, (err) => {
      if (err) {
        console.error('Error while saving the file:', err);
      } else {
        console.log('The file has been saved successfully.');
      }
    })
    
    sendData(req, res);
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

    const pageNumbers = req.body.pageNumbers;

    pageNumbers.sort((a, b) => a - b);
    console.log("pageNumbers:", pageNumbers);

    let numDeletedPages = 0;
    for (const pageNum of pageNumbers) {
      pdfDoc.removePage(pageNum - 1 - numDeletedPages);
      numDeletedPages++;
    }

    const pdfBytes = await pdfDoc.save();

    const filePath = getCurrentFile();

    fs.writeFileSync(filePath, pdfBytes, (err) => {
      if (err) {
        console.error('Error while saving the file:', err);
      } else {
        console.log('The file has been saved successfully.');
      }
    })

    sendData(req, res);

    // res.setHeader('Content- mbType', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename=modified.pdf');
    // res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
}
const reorderPages = async (req, res) => {
  try {
    const uint8Array = fs.readFileSync(getCurrentFile());
    console.log(uint8Array);
    const pdfDoc = await PDFDocument.load(uint8Array);

    const source = req.body.source - 1;
    const dest = req.body.dest - 1;

    const totalPages = pdfDoc.getPageIndices();

    let temp = 0;
    temp = totalPages[source];
    totalPages[source] = totalPages[dest];
    totalPages[dest] = temp;

    const pageNumbers = totalPages;

    for (let i = 0; i < pageNumbers.length; i++) {
      pageNumbers[i] = parseInt(pageNumbers[i]);
    }

    console.log(typeof pageNumbers, ":", pageNumbers);

    const reorderedPdfDoc = await PDFDocument.create();

    const copiedPages = await reorderedPdfDoc.copyPages(pdfDoc, pageNumbers)
    for(let i = 0; i<pageNumbers.length; i++) {
      reorderedPdfDoc.addPage(copiedPages[i]);
    }

    // Save the reordered PDF to a new file
    const pdfBytes = await reorderedPdfDoc.save();

    const filePath = getCurrentFile();

    fs.writeFileSync(filePath, pdfBytes, (err) => {
      if (err) {
        console.error('Error while saving the file:', err);
      } else {
        console.log('The file has been saved successfully.');
      }
    })

    sendData(req, res);

    // res.setHeader('Content- mbType', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename=modified.pdf');
    // res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
}

module.exports = {
  addPages,
  deletePages,
  reorderPages,
}