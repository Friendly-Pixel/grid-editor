#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const util = require("util");
const fs = require("fs");
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

/**
 * Prepare a major, minor or patch release.
 */
const types = ['major', 'minor', 'patch'];
const type = process.argv[2];
const typeIndex = types.indexOf(type);
if (process.argv.length != 3 || !types.includes(type)) {
  console.error(`Usage: ./${path.basename(process.argv[1])} [major|minor|patch]`);
  process.exit(1);
}

process.argv;

// Get latest git version tag
const tags = execSync('git tag -l')
  .toString()
  .split('\n');
if (tags.length <= 1) {
  throw 'Could not load git tag names';
}
const tag = tags[tags.length - 2];
const tagParts = tag.replace('v', '').trim().split('.').map(p => parseInt(p));
console.log(`Last version: ${tag}`);

// Create new version
const newVersionParts = tagParts
  .slice()
  .map((value, i) => {
    if (i == typeIndex) value++;
    if (i > typeIndex) value = 0;
    return value;
  });
const newVersion = newVersionParts.join('.');
const newTag = 'v' + newVersionParts.join('.');
console.log(`New version tag: ${newTag}`);

execSync(`npm run build`);
replaceInFile('package.json', /"version": "[0-9.]+"/, `"version": "${newVersion}"`)
replaceInFile('bower.json', /"version": "[0-9.]+"/, `"version": "${newVersion}"`)
execSync(`git add -A`);

confirm(`This will:
* committing to git
* git tag
* git push
* npm publish

Please  check git staging area

Type y to confirm:`).then(() => {
  execSync(`git commit -m ${newTag}`);
  execSync(`git tag ${newTag}`);
  execSync(`git push`);
  execSync(`git push --tags`);
  execSync(`npm publish`);
});


function confirm(question) {
  return new Promise((resolve) => {
    readline.question(question, answer => {
      readline.close();
      resolve(answer);
    });
  })
}

function replaceInFile(filename, searchValue, replaceValue) {
  return fs.writeFileSync(filename,
    fs.readFileSync(filename).toString().replace(searchValue, replaceValue)
  );
}
