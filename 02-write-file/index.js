const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { EOL } = require('os');

const exit = function() {
  out.close();
  process.stdout.write(EOL + 'Exiting... Have a good day! Bye bye!' + EOL);
  process.exit();
};

process.on('SIGINT', () => {
  exit();
});

const out = fs.createWriteStream(path.join(__dirname, 'test.txt'));
out.write('', () => {
  process.stdout.write('Please, enter message (ctrl + c or "exit" - exits the program):' + EOL);

  readline.createInterface({input: process.stdin})
    .on('line', function(line) {
      if (line === 'exit') {
        exit();
      }
      out.write(line + EOL);
    });
});




