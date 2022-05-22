const path = require('path');
const fs = require('fs');


const patchList= fs.createReadStream(path.join(__dirname, 'text.txt'));

let data = '';
patchList.on('data', chunk => data += chunk);
patchList.on('end', () => console.log(data));
patchList.on('error', err => console.log('Error: ', err.message));