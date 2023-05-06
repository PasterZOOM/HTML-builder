const {readdir, stat} = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

(async () => {
  const folderContents = await readdir(folderPath, {withFileTypes: true});

  await Promise.all(folderContents.map(async file => {
    const filePath = path.join(folderPath, file.name);
    const data = await stat(filePath);

    if (data.isFile()) {
      const name = file.name.replace(/\.[^.]+$/, '');
      const extname = path.extname(filePath).slice(1);
      const size = data.size * 0.001;

      console.log(`${name} - ${extname} - ${size}kb`);
    }
  }));
})();
