const fs = require('fs');

// directory paths
const dataDirectory = './data/';
const trimmedDataDirectory = './data-trimmed/';

// list all files in the source directory
fs.readdir(dataDirectory, (err, files) => {
    if (err) {
        throw err;
    }

    // loop through all the files and parse content
    for (const file of files) {
        // skip misc.json
        if (file !== 'misc.json') {
            fs.readFile(`./data/${file}`, 'utf8', function (err, data) {
                const content = JSON.parse(data);

                const trimmed = Object.keys(content).reduce((accumulator, key) => {
                    // skip words that have less than 4 letters
                    // skip words with spaces
                    // skip words with hyphens
                    // skip words with full stops
                    // skip words with apostrophes
                    // skip words that dont contain definitions/meanings
                    if (
                        key.length > 3 &&
                        !key.includes(' ') &&
                        !key.includes('-') &&
                        !key.includes('.') &&
                        !key.includes('\'') &&
                        content[key].meanings
                    ) {
                        accumulator[key] = { d: content[key].meanings.map(meaning => meaning.def) }
                    }

                    return accumulator;
                }, {});

                console.log(`[${file}] -`, `original:`, Object.keys(content).length, `trimmed:`, Object.keys(trimmed).length);

                // write trimmed data back to json file - {letter}.json
                fs.writeFile(`${trimmedDataDirectory}${file}`, JSON.stringify(trimmed, null, 4), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            });
        }
    }
});
