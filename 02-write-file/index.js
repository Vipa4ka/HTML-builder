const fs = require('fs');
const path = require('path');

const readLine = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const patchList = fs.createWriteStream(path.join(__dirname, 'text.txt'));

readLine.write('Enter your text\n');

readLine.on('line', (text) => {
  if (text.trim() === 'exit') readLine.close();

  patchList.write(`${text}\n`, error => {
    if (error) throw error;
  });
});

readLine.on('close', () => {
  process.exit();
});


process.on('exit', code => {
  if (code === 0) {
    console.log('Thanks for checking!');
  } else {
    console.log(`Error in code ${code}`);
  }
});

process.on('SIGINT', () => {
  process.exit();
});
