const {readdir, stat} = require('fs/promises');
const path = require('path');
const {createReadStream, createWriteStream} = require('fs');

const output = createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
(async () => {
  const stylesPath = path.join(__dirname, 'styles');
  const stylesContents = await readdir(stylesPath, {withFileTypes: true});

  await Promise.all(stylesContents.map(async file => {
    const filePath = path.join(stylesPath, file.name);
    const input = createReadStream(filePath, 'utf-8');

    const extname = path.extname(filePath);
    const data = await stat(filePath);

    if (data.isFile() && extname === '.css') {
      input.on('data', chunk => output.write(chunk));
    }
  }));
})();
