const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { EOL } = require('os');

const out = fs.createWriteStream(path.normalize(__dirname + '/test.txt'));

const exit = function() {
  out.close();
  process.stdout.write(EOL + 'Exiting... Have a good day! Bye bye!' + EOL);
  process.exit();
};

process.on('SIGINT', () => {
  exit();
});

readline.createInterface({input: process.stdin})
  .on('line', function(line) {
    if (line === 'exit') {
      exit();
    }
    out.write(line + EOL);
  });
