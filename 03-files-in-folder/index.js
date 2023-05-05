const {readdir, stat} = require('fs/promises');
const path = require('path');
const filePath = path.join(__dirname, 'secret-folder');

(async () => {
  const folderContents = await readdir(filePath, {withFileTypes: true});
  const files = folderContents.filter(el => el.isFile());

  await Promise.all(files.map(async file => {
    const data = await stat(`${filePath}/${file.name}`);

    if (data.isFile()) {
      const name = file.name.replace(/\.[^.]+$/, '');
      const extname = path.extname(`${filePath}/${file.name}`).slice(1);
      const size = data.size * 0.001;

      console.log(`${name} - ${extname} - ${size}kb`);
    }
  }));
})();
