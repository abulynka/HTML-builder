const fsPromises = require('fs/promises');
const path = require('path');

async function copyDir(from, to) {
  from = path.normalize(from);
  to = path.normalize(to);

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
    const pathFrom = from + '/' + element.name;
    const pathTo = to + '/' + element.name;
    if (element.isDirectory()) {
      await copyDir(
        pathFrom,
        pathTo);
    } else if (element.isFile()) {
      await fsPromises.copyFile(pathFrom, pathTo);
    }
  }
}

copyDir(__dirname + '/files', __dirname + '/files-copy').then();
