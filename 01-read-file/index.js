const path = require('path');
const fs = require('fs');
const {stdout, exit} = process;

const filePath = path.join(__dirname, 'text.txt');

fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    stdout.write(`Файла ${filePath} не существует\n`);
    exit();
  }
});

const stream = fs.createReadStream(filePath, 'utf-8');

let text = '';

stream.on('data', chunk => text += chunk);
stream.on('end', () => stdout.write(`${text}\n`));
stream.on('error', error => stdout.write(`Error: ${error.message}\n`));