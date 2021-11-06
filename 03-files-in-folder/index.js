const fsPromises = require('fs/promises');
const path = require('path');
const { EOL } = require('os');

async function readDir(scanPath) {
  scanPath = path.normalize(scanPath);

  for (const element of (await fsPromises.readdir(scanPath, {withFileTypes: true}))) {
    if (element.isFile()) {
      const handler = await fsPromises.open(path.normalize(scanPath + '/' + element.name), 'r');
      console.log(path.parse(element.name));
      process.stdout.write(
        path.parse(element.name).name
        + ' - '
        + path.parse(element.name).ext.split('.').join('')
        + ' - '
        + ((await handler.stat()).size / 1024).toFixed(1) + 'kb'
        + EOL
      );
      await handler.close();

    } else if (element.isDirectory()) {
      await readDir(scanPath + '/' + element.name);
    }
  }
}

readDir(__dirname + '/secret-folder').then();
