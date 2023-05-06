const {readdir, mkdir, rm, copyFile} = require('fs/promises');
const path = require('path');

(async () => {
  const folderPath = path.join(__dirname, 'files');
  const folderCopyPath = path.join(__dirname, 'files-copy');

  await rm(folderCopyPath, {recursive: true, force: true});
  await mkdir(folderCopyPath, {recursive: true});

  const folderContents = await readdir(folderPath, {withFileTypes: true});

  folderContents.forEach(file => {
    const filePath =  path.join(folderPath, file.name);
    const fileCopyPath =  path.join(folderCopyPath, file.name);
    copyFile(filePath, fileCopyPath);
  });
})();
