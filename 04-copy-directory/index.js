const path = require('path');
const { mkdir } = require('fs');
const { copyFile } = require('fs/promises');
const fsPromise = require('fs/promises');
const dirPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');
(async function copyDir() {
  await fsPromise.rm(destPath, { recursive: true, force: true }, (err) => {
    if (err) {
      throw err;
    }
  });
  mkdir(destPath, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
    console.log('Folder Created');
  });

  await fsPromise.readdir(dirPath).then((files) => {
    files.forEach((file) => {
      const filePath = path.join(__dirname, 'files', file);
      copyFile(filePath, path.join(destPath, file));
    });
  });
})();
