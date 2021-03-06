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
const outputPath = path.resolve(path.join(outputSource));

// Check if directory exists
fs.stat(sourcePath, (error) => {
    if (error) {
        console.log('Your input source cannot be found');
        return;
    }

    const chalk = require('chalk');
    const parseXML = require('../scripts/parseXML');
    const parseFolders = require('../scripts/parseFolders');
    const cleanFolders = require('../scripts/cleanFolders');
    const displayResults = require('../scripts/displayResults');
    console.time('Total time');
    console.log(chalk.green('Start processing...\n'));
    parseXML(path.relative(process.cwd(), argv.config))
    .then(parseFolders.bind(this, sourcePath))
    .then(cleanFolders.bind(this, sourcePath, outputPath))
    .then((data) => {
        const promises = [];
        if (argv.export) {
            const exportResults = require('../scripts/exportResults');
            promises.push(exportResults(path.join(outputPath, argv.export), data));
        } 
        
        if (argv.optim) {
            const optimize = require('../scripts/optimize');
            promises.push(optimize(data.copiedImages, sourcePath, outputPath, {
                quality: argv.quality
            }));
        }
        return Promise.all(promises).then((values) => {
            values.forEach((value) => {
                Object.assign(data, value);
            });
            
            return data;
        });
    })
    .then(displayResults.bind(this, outputPath))
    .then(() => {
        console.log('\n---------------------------------------------------------------');
        console.log(chalk.bold(' Total duration '));
        console.log('---------------------------------------------------------------\n');
        console.timeEnd('Total time');
    })
}); 
