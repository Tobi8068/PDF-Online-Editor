let currentFile = 'uploads/d4aad56f854a473ad280b26b2ead3e3c.pdf';

const setCurrentFile = (value) => {
  currentFile = value;
}

const getCurrentFile = () => {
  return currentFile;
}

module.exports = {
  setCurrentFile,
  getCurrentFile,
};