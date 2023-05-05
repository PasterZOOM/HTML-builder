const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const {stdout, stdin, exit} = process;

const emitter = new EventEmitter();
const filePath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(filePath);

stdout.write('Введи то, что хочешь ввести\n');

emitter.on('thisIsTheEnd', () => {
  stdout.write('Прощай! И... УДАЧИ!!!\n');
  exit();
});
stdin.on('data', data => {
  if (data.toString().toLowerCase().trim() === 'exit'){
    emitter.emit('thisIsTheEnd');
  } else {
    output.write(data);
  }
});
process.on('SIGINT', () => emitter.emit('thisIsTheEnd'));
