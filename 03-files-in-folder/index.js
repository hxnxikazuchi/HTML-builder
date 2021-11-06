const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');
const directoryPath = path.join(__dirname, 'secret-folder');

fsPromise.readdir(directoryPath, { withFileTypes: true }).then((files) => {
  files.forEach(function (file) {
    if (file.isFile()) {
      const filePath = path.join(__dirname, 'secret-folder', file.name);
      const fileName = path.basename(filePath);
      const extension = path.extname(fileName);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.log('File doesn\'t exist');
        } else {
          const size = stats.size;
          console.log(
            `${fileName.replace(extension, '')} - ${extension.replace(
              '.',
              ''
            )} - ${size}b`
          );
        }
      });
    }
  });
});
