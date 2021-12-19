const cliProgress = require('cli-progress');
const fs = require('fs');

const onlyDomainNames = require('./results.json')
const names = fs.readFileSync('./first_names.all.txt').toString().split('\n');
const words = fs.readFileSync('./words.txt').toString().split('\n');
const threeLetterNames = names.filter(name => name.length === 3);
const threeLetterWords = words.filter(word => word.length === 3);
const allThreeLetterWords = threeLetterNames.concat(threeLetterWords);
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar.start(onlyDomainNames.length, 0);
count = 0
const availableNames = onlyDomainNames.filter(name => {
  bar.update(++count)
  return allThreeLetterWords.includes(name)
})
bar.stop();
console.dir(availableNames, { maxArrayLength: null })

console.dir(names.filter(name => name.length === 5), { maxArrayLength: null })