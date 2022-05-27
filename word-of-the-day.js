const fs = require('fs');
const profanitiesList = require('profane-words');

// directory paths
const dataDirectory = './data/';
const wordOfTheDayDataArrayDirectory = './word-of-the-day/';

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

            for (const word of Object.keys(content)) {
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
                    allWords.push({[word]: content[word].meanings[0].def});
                }
            }
        }
    }

    // Randomly sort array and get the first 366 words
    const randomizedSampleAndFlattened =  allWords
        .sort(() => Math.random() - Math.random())
        .slice(0, 367).flat()
        .reduce((accumulator, word) => {
            accumulator[Object.keys(word)[0]] = word[Object.keys(word)[0]];
            return accumulator;
    }, {});

    // write the words of the day data back to a json file - words-of-the-day-2022.json
    fs.writeFile(`${wordOfTheDayDataArrayDirectory}words-of-the-day-2022.json`, JSON.stringify(randomizedSampleAndFlattened, null, 4), function (err) {
        if (err) {
            return console.log(err);
        }
    });
});
