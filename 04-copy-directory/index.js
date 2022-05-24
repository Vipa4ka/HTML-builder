const fs = require('fs');
const path = require('path');
const pathCopy = path.join(__dirname, 'files-copy');
const pathFile = path.join(__dirname, 'files');


const copyFiles = () => {
  fs.readdir(pathFile, { withFileTypes: true }, (error, files) => {
    if (error) console.error(error);
    else {
      files.forEach((el) => {
        if (!el.isDirectory()) {
          fs.promises.copyFile(
            path.join(pathFile, el.name),
            path.join(pathCopy, el.name)
          );
        }
      });
    }
  });
};

fs.mkdir(pathCopy, { recursive: true }, (error) => {
  if (error) return console.error(error);

  fs.readdir(pathCopy, { withFileTypes: true }, (error, files) => {
    if (error) return console.error(error);
    const cleaning = [];
    files.forEach((file) => {
      cleaning.push(
        new Promise((res, rej) => {
          fs.unlink(path.join(pathCopy, file.name), (error) => {
            if (error) {
              rej(error);
              console.error(error);
            } else {
              res();
            }
          });
        })
      );
    });

    Promise.all(cleaning).then(copyFiles);
  });
});




