const express = require('express');
const mongoose = require('mongoose');
const getRandomInt = require('../../utils/randomInt');
const shuffle = require('../../utils/shuffle');
const { RealTweet, FakeTweet, Tweet } = require('../models/Tweet');

const NUM_TWEETS = 50;
const ERROR = `ERROR [${__dirname}]:`;

let realTweetCount;
let fakeTweetCount;

console.log('TESTING', process.env.MONGODB_PW);

const uri = `mongodb+srv://akhil:${process.env.MONGODB_PW}@real-or-fake.aqihu.mongodb.net/fake-or-real?retryWrites=true&w=majority`;
mongoose.connect(uri, {useNewUrlParser: true})
  .then(async () => {
    try {
      realTweetCount = await RealTweet.countDocuments();
      fakeTweetCount = await FakeTweet.countDocuments();
    } catch (err) {
      console.log(ERROR, err);
    }
  })
  .catch((err) => console.error('[tweetsRouter] could not connect to database.', err));

// Instantiate router
const router = express.Router();

// async query helper
async function queryTweets(n, k) {
  try {
    const queriedRealTweets = await RealTweet.find().limit(n);
    const queriedFakeTweets = await FakeTweet.find().limit(k);
    const combinedQueriedTweets = queriedRealTweets.concat(queriedFakeTweets);
    shuffle(combinedQueriedTweets);
    return combinedQueriedTweets;
  } catch (err) {
    console.log(ERROR, err);
  }
}

// routes
router.get('/', async (req, res) => {
  // send NUM_TWEETS mixed tweets
  const n = Math.min(realTweetCount, NUM_TWEETS);
  const k = Math.min(fakeTweetCount, getRandomInt(0, n + 1));
  const tweets = await queryTweets(n - k, k);
  res.json(tweets);
})

router.get('/:n', async (req, res) => {
  // n is total number of tweets
  // choose number of real:fake tweets
  const n = Math.min(realTweetCount, parseInt(req.params.n));
  const k = Math.min(fakeTweetCount, getRandomInt(0, n + 1));
  const tweets = await queryTweets(n - k, k);
  res.json(tweets);
})

router.get('/:n/:k', async (req, res) => {
  // n + k is total number of tweets
  // choose number of real:fake tweets
  const n = Math.min(realTweetCount, parseInt(req.params.n));
  const k = Math.min(fakeTweetCount, parseInt(req.params.k));
  const tweets = await queryTweets(n, k);
  res.json(tweets);
})

module.exports = router;