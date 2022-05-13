const fs = require('fs');
const profanitiesList = require('profane-words');

// directory paths
const dataDirectory = './data/';
const trimmedDataArrayDirectory = './data-trimmed/';

// list all files in the source directory
fs.readdir(dataDirectory, (err, files) => {
    if (err) {
        throw err;
    }

    const allWords = [];

    // loop through all the files and parse content
    for (const file of files) {
        // skip misc.json
        if (file !== 'misc.json') {
            const fileContents = fs.readFileSync(`./data/${file}`, 'utf8');
            const content = JSON.parse(fileContents);

            const trimmed = Object.keys(content).reduce((accumulator, word) => {
                if (
                    // skip words that have less than 4 letters
                    word.length > 3 &&
                    // skip words with spaces
                    !word.includes(' ') &&
                    // skip words with hyphens
                    !word.includes('-') &&
                    // skip words with full stops
                    !word.includes('.') &&
                    // skip words with apostrophes
                    !word.includes('\'') &&
                    // skip words that contain capital letters
                    !/[A-Z]/.test(word) &&
                    // add words that contain "meanings"
                    content[word].meanings &&
                    // skip words that start with a word from the profanity list
                    !profanitiesList.find((profanity) => word.startsWith(profanity)) &&
                    // skip words that end with a word from the profanity list
                    !profanitiesList.find((profanity) => word.endsWith(profanity))
                ) {
                    accumulator.push(word);
                    allWords.push(word);
                }

                return accumulator;
            }, []);

            console.log(`[${file}] -`, `original:`, Object.keys(content).length, `trimmed:`, Object.keys(trimmed).length);

            // write trimmed data back to csv file - {letter}.csv
            fs.writeFileSync(`${trimmedDataArrayDirectory}${file.replace('.json', '.csv')}`, trimmed.sort().join('\n'), function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            // write trimmed data back to json file - {letter}.json
            fs.writeFileSync(`${trimmedDataArrayDirectory}${file}`, JSON.stringify(trimmed.sort(), null, 4), function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    }

    // write trimmed all data back to a json file - all.json
    fs.writeFile(`${trimmedDataArrayDirectory}all.json`, JSON.stringify(allWords.sort(), null, 4), function (err) {
        if (err) {
            return console.log(err);
        }
    });

    // write trimmed all data back to a csv file - all.csv
    fs.writeFile(`${trimmedDataArrayDirectory}all.csv`, allWords.sort().join('\n'), function (err) {
        if (err) {
            return console.log(err);
        }
    });
});
