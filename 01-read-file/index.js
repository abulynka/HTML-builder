const fs = require('fs');
const path = require('path');

fs.createReadStream(
  path.normalize(__dirname + '/text.txt')
).pipe(process.stdout);
