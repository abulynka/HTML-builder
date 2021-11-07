const fsPromises = require('fs/promises');
const path = require('path');

async function copyDir(from, to) {
  if (await fsPromises.access(from) === false) {
    throw new Error('File or directory ' + from + ' does not exist');
  }

  try {
    await fsPromises.stat(to);
    await fsPromises.rm(to, {recursive: true,});
  } catch (e) {
    // nothing to do
  }
  await fsPromises.mkdir(to);

  for (const element of (await fsPromises.readdir(from, {withFileTypes: true}))) {
    const pathFrom = path.join(from, element.name);
    const pathTo = path.join(to, element.name);

    if (element.isDirectory()) {
      await copyDir(
        pathFrom,
        pathTo);
    } else if (element.isFile()) {
      await fsPromises.copyFile(pathFrom, pathTo);
    }
  }
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy')).then();
