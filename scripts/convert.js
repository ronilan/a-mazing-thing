/*
* Utility Script:
* Converts an original maze in txt format to json containing a two-dimensional array
*
* Usage: node scripts/convert.js mazes/1.txt > mazes/1.json
*/

const fs = require('fs');

const pathToFile = process.argv[2];

const originalMaze = fs.readFileSync(pathToFile).toString().split('\n');

const newMaze = originalMaze.map((line) => {
  let convertedLine = '';

  for (let i = 0; i < line.length + 1; i += 3) {
    // for every row replace the string cell/wall representation with strings of 1 and 0
    // note: order is important
    convertedLine += line.substr(i, 3)
      .replace('+--', '11')
      .replace('+  ', '10')
      .replace('   ', '00')
      .replace('|  ', '10')
      .replace('+', '1')
      .replace('|', '1')
      .replace(' ', '0')
      .replace(/\r/g, '');
  }

  // make every an array of numbers
  convertedLine = convertedLine.split('').map(item => parseInt(item, 10));

  return convertedLine;
}).filter(line => line.length > 4)

const output = { maze: newMaze };
console.log(JSON.stringify(output));
