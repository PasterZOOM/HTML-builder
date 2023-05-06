const {readdir, mkdir, rm, writeFile, copyFile, stat} = require('fs/promises');
const path = require('path');
const {createWriteStream, createReadStream} = require('fs');

const assetsPath = path.join(__dirname, 'assets');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');

//create 'project-dist' folder
(async () => {
  await mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
})();

const dist = path.join(__dirname, 'project-dist');

//copy 'assets' folder
(async function copyDir(dir, copiedItemsPath) {
  const copyItemsPath = dir;

  await rm(copyItemsPath, {recursive: true, force: true});
  await mkdir(dir, {recursive: true});

  const folderContents = await readdir(copiedItemsPath, {withFileTypes: true});

  folderContents.forEach(file => {
    if (file.isFile()) {
      const filePath = path.join(copiedItemsPath, file.name);
      const fileCopyPath = path.join(copyItemsPath, file.name);
      copyFile(filePath, fileCopyPath);
    } else {
      copyDir(path.join(dir, file.name), path.join(copiedItemsPath, file.name));
    }
  });
})(path.join(dist, 'assets'), assetsPath);

// create 'style.css' file
const style = createWriteStream(path.join(dist, 'style.css'));
(async () => {
  const stylesContents = await readdir(stylesPath, {withFileTypes: true});

  await Promise.all(stylesContents.map(async file => {
    const filePath = path.join(stylesPath, file.name);
    const input = createReadStream(filePath, 'utf-8');

    const extname = path.extname(filePath);
    const data = await stat(filePath);

    if (data.isFile() && extname === '.css') {
      input.on('data', chunk => style.write(chunk));
    }
  }));
})();

// create 'index.html' file
(async () => {
  let templateContent = '';

  const indexStream = createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  indexStream.on('data', chunk => templateContent += chunk);

  const componentsContents = await readdir(componentsPath, {withFileTypes: true});

  await Promise.all(componentsContents.map(async file => {
    const nameAlias = `{{${file.name.replace(/\.[^.]+$/, '')}}}`;
    const filePath = path.join(componentsPath, file.name);
    const extname = path.extname(filePath);
    const data = await stat(filePath);

    if (data.isFile() && extname === '.html') {
      const stream = createReadStream(filePath, 'utf-8');
      stream.on('data', chunk => {
        templateContent = templateContent.replace(nameAlias, chunk.toString());
      });
      stream.on('end', () => writeFile(path.join(dist, 'index.html'), templateContent));
    }
  }));
})();




