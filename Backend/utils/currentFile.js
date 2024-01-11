let currentFile = '';

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