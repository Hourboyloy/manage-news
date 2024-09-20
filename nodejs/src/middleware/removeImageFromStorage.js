const fs = require("fs");

const removeImageFromStorage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err.message}`);
    } else {
      console.log(`File deleted: ${filePath}`);
    }
  });
};

module.exports = removeImageFromStorage;
