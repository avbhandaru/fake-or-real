#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const parse = require('csv-parser');
const stringify = require('csv-stringify');

// command line yargs
const argv = require('yargs')
  .usage('Usage: ./filter.js -d [path/to/data] -s [path/to/scheme] -o [path/to/output]')
  .demandOption(['d', 's'])
  .argv;
console.log('data.csv:', argv.d);
console.log('scheme.js:', argv.s);

// load data path and scheme
const dataPath = path.join(__dirname, '..', argv.d);
const scheme = require(path.join(__dirname, '..', argv.s));
const outputFile = argv.o;

// filters
function checkReply(tweet) {
  // check if contains quote and if contains @handle
  const quoteRegex = new RegExp(/\".*\"/g);
  const atRegex = new RegExp(/@[a-zA-Z\d]*\s/g);
  // allows for quotes in trump tweets, although consider changing this
  if (tweet.tweet.match(quoteRegex) && tweet.tweet.match(atRegex)) {
    return true;
  } else if (tweet.tweet.match(atRegex)) {
    return true;
  }
  return false;
}

function checkRetweet(tweet) {
  // consider deleting this
  if (tweet.is_retweet) {
    return true;
  }
  return false
}

function checkContainsURL(tweet) {
  // this will also catch url based retweets
  // tests for http://, https://, and www.
  const httpExpression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  const wwwExpression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  const httpRegex = new RegExp(httpExpression);
  const wwwRegex = new RegExp(wwwExpression);
  if (tweet.tweet.match(httpRegex) || tweet.tweet.match(wwwRegex)) {
    return true;
  }
  return false;
}

const filters = [
  checkReply,
  checkRetweet,
  checkContainsURL
]

// filter
function isValid(tweet) {
  let isValidTweet = true;
  filters.forEach(filter => {
    isValidTweet = isValidTweet && !filter(tweet);
  })
  return isValidTweet;
}

function filterCSV(dataPath, outputFile, callback) {
  let tweets = [];
  fs.createReadStream(dataPath)
    .pipe(parse())
    .on('data', entry => {
      const tweet = scheme(entry);
      if (!isValid(tweet)) {
        console.log(
          `[filter.js] tweet[${tweet.id}] filtered from ${dataPath}:\n\t`,
          'Filtered tweet:\n\t',
          `${tweet.tweet}\n`
        );
      } else {
        tweets.push(tweet);
      }
    })
    .on('end', () => {
      callback(tweets, dataPath, outputFile)
    })
}

// writer
function outputCSV(tweets, dataPath, outputFile) {
  outputFile = outputFile || '';
  if (outputFile === '') {
    const dataFileName = dataPath.split('.')[0];
    outputFile = `${dataFileName}.filtered.csv`;
  }
  options = {
    header: true,
    columns: [
      { key: 'tweet' },
      { key: 'answer' },
      { key: 'metadata.author',
        header: 'author' },
      { key: 'metadata.handle',
        header: 'handle' },
      { key: 'metadata.url',
        header: 'url' },
      { key: 'metadata.date',
        header: 'date' },
      { key: 'metadata.is_retweet',
        header: 'is_retweet' },
      { key: 'metadata.num_comments',
        header: 'num_comments' },
      { key: 'metadata.num_retweets',
        header: 'num_retweets' },
      { key: 'metadata.num_favorites',
        header: 'num_favorites' }
    ]
  }
  stringify(tweets, options, (err, data) => {
    if (err) {
      console.log('[filter.js] stringify error:', err);
    } else {
      fs.writeFile(outputFile, data, err => {
        if (err) {
          console.log('[filter.js] writeFile error:', err);
        }
      });
    }
  });
}

// output filtered tweet
filterCSV(dataPath, outputFile, outputCSV);
