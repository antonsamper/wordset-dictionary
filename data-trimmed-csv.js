const fs = require('fs');

// directory paths
const dataDirectory = './data/';
const trimmedDataArrayDirectory = './data-trimmed-csv/';

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

            const trimmed = Object.keys(content).reduce((accumulator, key) => {
                // skip words that have less than 4 letters
                // skip words with spaces
                // skip words with hyphens
                // skip words with full stops
                // skip words with apostrophes
                // skip words that dont contain definitions/meanings
                // skip words that contain capital letters
                if (
                    key.length > 3 &&
                    !key.includes(' ') &&
                    !key.includes('-') &&
                    !key.includes('.') &&
                    !key.includes('\'') &&
                    !/[A-Z]/.test(key) &&
                    content[key].meanings
                ) {
                    accumulator.push(key);
                }

                return accumulator;
            }, []);

            console.log(`[${file}] -`, `original:`, Object.keys(content).length, `trimmed:`, Object.keys(trimmed).length);

            // write trimmed data back to json file - {letter}.csv
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
});
