
const path = require('path');
const fs = require('fs');


fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (error, array) => {
  if (error) throw error;
  array.forEach(el => {
    if (!el.isDirectory()) {
      fs.stat(path.join(__dirname, 'secret-folder', el.name), (error, st) => {
        if (error) throw error;
        const result = el.name.split('.');              
        result.push((st.size / 1000) + 'kb');
        console.log(`${result.join(' - ')}`);
      });
    }
  });
});