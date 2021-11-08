const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fsPromise.rm(bundlePath, { recursive: true, force: true }, (err) => {
  if (err) {
    throw err;
  }
});

fsPromise.readdir(stylesPath, { withFileTypes: true }).then((files) => {
  const styleArr = [];
  files.forEach((file) => {
    const filePath = path.join(stylesPath, file.name);
    const extension = path.extname(filePath);
    const readStyle = fs.createReadStream(
      path.join(stylesPath, file.name),
      'utf-8'
    );
    if (file.isFile() && extension === '.css') {
      readStyle.on('data', (data) => {
        styleArr.push(data);
        const bundle = fs.createWriteStream(bundlePath);
        bundle.on('error', (err) => {
          throw err;
        });
        styleArr.forEach((line) => {
          bundle.write(`${line}\n`);
        });
        bundle.end();
      });
    }
  });
  console.log('The file merged');
});
