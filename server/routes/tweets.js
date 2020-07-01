const express = require('express');
const mongoose = require('mongoose');
const getRandomInt = require('../../utils/randomInt');
const { RealTweet, FakeTweet, Tweet } = require('../models/Tweet');

const ERROR = `ERROR [${__dirname}]:`;

let realTweetCount;
let fakeTweetCount;

const uri = "mongodb+srv://akhil:r0Lx2SwPS02VF6IN@real-or-fake.aqihu.mongodb.net/fake-or-real?retryWrites=true&w=majority";
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

// routes
router.get('/', (req, res) => {
  res.send('This is the tweets api! [HELP] /api/tweets/:n, /api/tweets/:n/:k to decide how mant real and fake quotes you want!');
})

router.get('/:n', async (req, res) => {
  // n is total number of tweets
  // choose number of real:fake tweets
  const n = Math.min(realTweetCount, parseInt(req.params.n));
  const k = Math.min(fakeTweetCount, getRandomInt(0, n + 1));
  try {
    const queriedRealTweets = await RealTweet.find().limit(n - k);
    const queriedFakeTweets = await FakeTweet.find().limit(k);
    res.json({
      tweetCounts: {
        rtCount: n - k,
        ftCount: k
      },
      realTweets: queriedRealTweets,
      fakeTweets: queriedFakeTweets
    });
  } catch (err) {
    console.log(ERROR, err);
  }
})

router.get('/:n/:k', async (req, res) => {
  // n + k is total number of tweets
  // choose number of real:fake tweets
  const n = Math.min(realTweetCount, parseInt(req.params.n));
  const k = Math.min(fakeTweetCount, parseInt(req.params.k));
  try {
    const queriedRealTweets = await RealTweet.find().limit(n);
    const queriedFakeTweets = await FakeTweet.find().limit(k);
    res.json({
      tweetCounts: {
        rtCount: n,
        ftCount: k
      },
      realTweets: queriedRealTweets,
      fakeTweets: queriedFakeTweets
    })
  } catch (err) {
    console.log(ERROR, err)
  }
})

module.exports = router;