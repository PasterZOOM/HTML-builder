const {readdir, mkdir, rm, copyFile} = require('fs/promises');
const path = require('path');

(async () => {
  const filesPath = path.join(__dirname, 'files');
  const filedCopyPath = path.join(__dirname, 'files-copy');

  await rm(filedCopyPath, {recursive: true, force: true});
  await mkdir(filedCopyPath, {recursive: true});

  const folderContents = await readdir(filesPath, {withFileTypes: true});

  folderContents.forEach(file => {
    copyFile(`${filesPath}/${file.name}`, `${filedCopyPath}/${file.name}`);
  });
})();
