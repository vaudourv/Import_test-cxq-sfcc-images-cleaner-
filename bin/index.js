const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const inputSource = process.argv[2];
const outputSource = process.argv[3];

if (!inputSource) {
    console.log('Input source is missing');
    return;
}

if (!outputSource) {
    console.log('Output source is missing');
    return;
}

if (!argv.config) {
    console.log('Missing configuration XML');
}

const sourcePath = path.resolve(inputSource);

// Check if directory exists
fs.stat(sourcePath, (error) => {
    if (error) {
        console.log('Your input source cannot be found');
        return;
    }

    const parseXML = require('../scripts/parseXML');
    const parseFolders = require('../scripts/parseFolders');

    parseXML(path.relative(process.cwd(), argv.config))
    .then(parseFolders);
}); 