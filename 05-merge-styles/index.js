const fs = require('fs');
const path = require('path');

const styleFolder = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist/bundle.css');

fs.readdir(styleFolder, { withFileTypes: true }, (error, files) => {
  if (error) console.error(error);
  const promises = [];
  const writable = fs.createWriteStream(bundlePath, 'utf8');

  files.forEach((f) => {
    if (path.extname(path.join(styleFolder, f.name)) === '.css') {
      promises.push(
        new Promise((res, rej) => {
          const rd = fs.createReadStream(
            path.join(styleFolder, f.name),
            'utf8'
          );

          rd.on('data', (chunk) => {
            writable.write(chunk);
          });

          rd.on('end', () => res());
          rd.on('error', (er) => rej(er));
        })
      );
    }
  });

  promises.reduce((prev, curr) => prev.then(() => curr));
});

