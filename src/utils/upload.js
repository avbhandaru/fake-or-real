#!/usr/bin/env node
const { RealTweet, FakeTweet, Tweet } = require('../server/models/Tweet');
const { MONGO_URI } = require('../enums/enums');
const { check } = require('./utils');
const fs = require('fs');
const parse = require('csv-parser');
const mongoose = require('mongoose');

// DATE CUTOFF
// Chose arbitrary date pre-election
const DATE_CUTOFF = new Date('2015-01-01 01:00:00');

const argv = require('yargs')
  .usage('Usage ./upload.js -d [path/to/filtered/data]')
  .demandOption(['d'])
  .argv;
const dataPath = argv.d;

function toTweet(entry) {
  return {
    tweet: entry.tweet,
    answer: entry.answer,
    metadata: {
      author: entry.author,
      handle: entry.handle,
      date: new Date(parseInt(entry.date)),
      is_retweet: entry.is_retweet === ''? false : JSON.parse(entry.is_retweet),
      num_comments: parseInt(entry.num_comments || 0),
      num_retweets: parseInt(entry.num_retweets || 0),
      num_favorites: parseInt(entry.num_comments || 0)
    }
  }
}

function saveCallback(err, doc) {
  if (err) {
    console.log('[upload.js] Could not save tweet:', err);
  } else {
    // console.log('Successfully saved', doc);
  }
}

const { MONGODB_UN, MONGODB_PW } = process.env;
mongoose.connect(MONGO_URI(MONGODB_UN, MONGODB_PW), { useNewUrlParser: true })
  .then(async () => {
    console.log(`[upload.js] Mongo DB connected. Uploading CSV at ${dataPath}`);
    fs.createReadStream(dataPath)
      .pipe(parse())
      .on('data', async entry => {
        let tweet = toTweet(entry);
        if (tweet.metadata.date >= DATE_CUTOFF) {
          if (check.isReal(tweet.answer)) {
            const realTweet = new RealTweet(tweet);
            await realTweet.save(saveCallback);
          } else {
            const fakeTweet = new FakeTweet(tweet);
            await fakeTweet.save(saveCallback);
          }
          tweet = new Tweet(tweet);
          await tweet.save(saveCallback);
        }
      })
  })
  .catch((err) => {
    console.log('[upload.js] Could not connect to Mongo DB:', err);
  })
