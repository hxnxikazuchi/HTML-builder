const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output, exit: exit } = require('process');
const fileWay = path.join(__dirname, 'yourFile.txt');
const rl = readline.createInterface({ input, output });

function write() {
  rl.question('\nWrite some text: ', (answer) => {
    fs.writeFile(fileWay, `${answer}\n`, { flag: 'a+' }, function (err) {
      if (err) {
        return console.log(err);
      }
      if (answer === 'exit') {
        sayBye();
      }
      console.log('The file was saved!');
      write();
    });
  });
  rl.on('SIGINT', sayBye);
}
write();

function sayBye() {
  console.log('\nHave a nice day!');
  exit();
}
