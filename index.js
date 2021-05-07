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
    files.forEach(file => {
        fs.readFile(`./data/${file}`, 'utf8', function (err, data) {
            const content = JSON.parse(data);

            const trimmed = Object.keys(content).reduce((accumulator, key) => {
                if (content[key].meanings) {
                    accumulator[key] = { d: content[key].meanings.map(meaning => meaning.def) }
                }

                return accumulator;
            }, {});

            fs.writeFile(`${trimmedDataDirectory}${file}`, JSON.stringify(trimmed, null, 4), function(err) {
                if(err) {
                    return console.log(err);
                }
            });
        });
    });
});
