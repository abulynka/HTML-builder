const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  throw new Error('Should include at least three arguments');
}

fs.createReadStream(path.normalize(process.argv[2])).pipe(process.stdout);
