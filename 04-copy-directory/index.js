const path = require('path');


const pathFile = path.join(__dirname, 'files');
const pathCopy = path.join(__dirname, 'files-copy');
const { mkdir, readdir, unlink, copyFile } = require('fs/promises');

const copyFolder = () => mkdir(pathCopy, { recursive: true });



const copyFilesFirst = () => {
  readdir(pathFile).then(el => {
    el.forEach(el => {
      const pathToFile = path.join(pathFile, el);
      copyFile(pathToFile, path.join(pathCopy, el));
    });
  });
};

const cleaning = () => {
  readdir(pathCopy).then(el => {
    el.forEach(el => {
      const pathToFile = path.join(pathCopy, el);
      unlink(pathToFile);
    });
  });
};

copyFolder()
  .then(() => cleaning())
  .then(() => copyFilesFirst())
  .catch(error => {throw error;});
