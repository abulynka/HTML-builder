const fsPromises = require('fs/promises');
const path = require('path');
const { EOL } = require('os');

async function merge(fromDirectory, toFile) {
  try {
    await fsPromises.stat(toFile);
    await fsPromises.rm(toFile);
  } catch (e) {
    // nothing to do
  }

  for (const element of (await fsPromises.readdir(fromDirectory, {withFileTypes: true}))) {
    const from = path.join(fromDirectory, element.name);

    if (element.isFile() === false) {
      continue;
    }

    const extension = path.parse(element.name).ext.split('.').join('');
    if (extension !== 'css') {
      continue;
    }

    await fsPromises.appendFile(
      toFile,
      await fsPromises.readFile(from) + EOL
    );
  }
}

merge(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'bundle.css')).then();
