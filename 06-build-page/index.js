const fs = require('fs');
const path = require('path');
const fsPromise = require('fs/promises');

const projectDist = path.join(__dirname, 'project-dist');
const compPath = path.join(__dirname, 'components');
const indexDist = path.join(projectDist, 'index.html');
const stylesPath = path.join(__dirname, 'styles');
const stylesDist = path.join(projectDist, 'style.css');
const dirPath = path.join(__dirname, 'assets');
const dirDist = path.join(projectDist, 'assets');
fs.mkdir(path.join(projectDist), { recursive: true }, (err) => {
  if (err) {
    throw err;
  }
});

const readTemplate = fs.createReadStream(
  path.join(__dirname, 'template.html'),
  'utf-8'
);
readTemplate.on('data', (templateData) => {
  fs.readdir(compPath, { withFileTypes: true }, (err, component) => {
    if (err) {
      throw err;
    }
    component.forEach((comp) => {
      if (comp.isFile() && path.extname(comp.name) === '.html') {
        const filePath = path.join(compPath, comp.name);
        const extension = path.extname(comp.name);
        const baseName = path.basename(comp.name, extension);
        const fileInner = fs.createReadStream(filePath, 'utf-8');
        fileInner.on('data', (data) => {
          const reg = RegExp(`{{${baseName}}}`, 'gi');

          templateData = templateData.replace(reg, data);
          fs.writeFile(indexDist, templateData, (err) => {
            if (err) {
              throw err;
            }
          });
        });
      }
    });
  });
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
        const bundle = fs.createWriteStream(stylesDist);
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
});

async function copyDir(src, dest) {
  await fsPromise.rm(dest, { recursive: true, force: true }, (err) => {
    if (err) {
      throw err;
    }
  });
  const entries = await fsPromise.readdir(src, { withFileTypes: true });
  await fsPromise.mkdir(dest, { recursive: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fsPromise.copyFile(srcPath, destPath);
    }
  }
}
copyDir(dirPath, dirDist);

