const fs = require('fs');
const path = require('path');
const { EOL } = require('os');

async function readDir(scanPath) {
  for (const element of (await fs.promises.readdir(scanPath, {withFileTypes: true}))) {
    if (element.isFile()) {
      const handler = await fs.promises.open(path.join(scanPath, element.name), 'r');

      process.stdout.write(
        path.parse(element.name).name
        + ' - '
        + path.parse(element.name).ext.split('.').join('')
        + ' - '
        + (await handler.stat()).size + 'b'
        + EOL
      );
      await handler.close();

    }
  }
}

readDir(path.join(__dirname, 'secret-folder')).then();
