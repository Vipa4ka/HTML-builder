const fs = require('fs');
const path = require('path');
const promiseFs = fs.promises;


const projectPath = path.join(__dirname, 'project-dist');

const bundleAssets = async (from, to) => {
  const files = await promiseFs.readdir(from, { withFileTypes: true });

  files.forEach((el) => {
    const trgt = path.join(to, el.name);
    const init = path.join(from, el.name);
    
    if (el.isDirectory()) {
      fs.mkdir(trgt, { recursive: true }, (error) => {
        if (error) console.error(error);
        else {
          bundleAssets(init, trgt);
        }
      });
    } else {
      promiseFs.copyFile(init, trgt);
    }
  });
};

const bundleStyles = async (from, to) => {
  const files = await promiseFs.readdir(from, { withFileTypes: true });

  const reading = [];
  const writable = fs.createWriteStream(to, 'utf8');

  files.forEach((file) => {
    if (path.extname(path.join(from, file.name)) === '.css') {
      reading.push(
        new Promise((res, rej) => {
          const readable = fs.createReadStream(
            path.join(from, file.name),
            'utf8'
          );
          readable.on('data', (chunk) => {
            writable.write(chunk);
          });

          readable.on('end', () => res());
          readable.on('error', (event) => rej(event));
        })
      );
    }
  });

  reading.reduce((prev, curr) => prev.then(() => curr));
};

const bundleComps = async (template, components, trgt) => {
  let templateList = await promiseFs.readFile(template, 'utf8');
  const compsObj = {};

  const comps = await promiseFs.readdir(components, { withFileTypes: true });
  const reading = [];

  comps.forEach((comp) => {
    if (path.extname(path.join(components, comp.name)) === '.html') {
      reading.push(
        new Promise((res, rej) => {
          const name = comp.name.replace('.html', '');
          fs.readFile(path.join(components, comp.name), 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              rej();
            } else {
              compsObj[name] = data;
              res();
            }
          });
        })
      );
    }
  });

  Promise.all(reading).then(() => {
    const regExp = /{{.*}}/g;
    const matches = [...templateList.matchAll(regExp)];
    matches.forEach((match) => {
      const reg = /{{|}}/g;
      templateList = templateList.replace(
        match[0],
        compsObj[match[0].replace(reg, '')]
      );
    });

    fs.writeFile(trgt, templateList, (err) => {
      if (err) console.error(err);
    });
  });
};

const bundle = (projectPath) => {
  const components = path.join(__dirname, 'components');
  const assets = path.join(__dirname, 'assets'); 
  const template = path.join(__dirname, 'template.html');
  const styles = path.join(__dirname, 'styles');

  fs.mkdir(projectPath, { recursive: true }, (error) => {
    if (error) console.error(error);
    else {
      bundleAssets(assets, path.join(projectPath, 'assets'));
      bundleStyles(styles, path.join(projectPath, 'style.css'));
      bundleComps(
        template,
        components,
        path.join(projectPath, 'index.html')
      );
    }
  });
};

fs.stat(projectPath, (error) => {
  if (error) bundle(projectPath);
  else {
    fs.rm(projectPath, { recursive: true }, (error) => {
      if (error) console.error(error);
      else bundle(projectPath);
    });
  }
});