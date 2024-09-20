const fs = require("fs");

const remove_and_update_Image = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err.message}`);
    } else {
      console.log(`File deleted: ${filePath}`);
    }
  });
};

module.exports = remove_and_update_Image;
