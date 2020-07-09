const express = require('express');
const mongoose = require('mongoose');
const enums = require('../../enums/enums');
const { getRandomInt, shuffle, check } = require('../../utils/utils');
const { RealTweet, FakeTweet } = require('../models/Tweet');

const NUM_TWEETS = 50;
const ERROR = enums.ERROR(__dirname);

let realTweetCount;
let fakeTweetCount;

mongoose.connect(
  enums.MONGO_URI(process.env.MONGODB_UN, process.env.MONGODB_PW),
  {useNewUrlParser: true}
)
  .then(async () => {
    try {
      realTweetCount = await RealTweet.countDocuments();
      fakeTweetCount = await FakeTweet.countDocuments();
    } catch (err) {
      console.log(ERROR, err);
    }
  })
  .catch((err) => console.error(ERROR, 'Could not connect to database:', err));

// Instantiate router
const router = express.Router();

// async query helper
async function queryTweets(n, k) {
  try {
    // Get n random RealTweets and k random FakeTweets
    const queriedRealTweets = await RealTweet.aggregate([
      { $sample: { size : n } }
    ]);
    const queriedFakeTweets = await FakeTweet.aggregate([
      { $sample: { size : k } }
    ]);
    const combinedQueriedTweets = queriedRealTweets.concat(queriedFakeTweets);
    shuffle(combinedQueriedTweets);
    return combinedQueriedTweets;
  } catch (err) {
    console.log(ERROR, err);
  }
}


// GET
router.get('/:n/:k', async (req, res) => {
  // n + k is total number of tweets
  // choose number of real:fake tweets
  try {
    const n = Math.min(realTweetCount, parseInt(req.params.n));
    const k = Math.min(fakeTweetCount, parseInt(req.params.k));
    const tweets = await queryTweets(n, k);
    res.status(200).json(tweets);
  } catch (err) {
    res.status(500).send(ERROR + ': ' + 'Something broke!');
  }
});

router.get('/:n', async (req, res) => {
  // n is total number of tweets
  // choose number of real:fake tweets
  try {
    const n = Math.min(realTweetCount, parseInt(req.params.n));
    const k = Math.min(fakeTweetCount, getRandomInt(0, n + 1));
    const tweets = await queryTweets(n - k, k);
    res.status(200).json(tweets);
  } catch (err) {
    res.status(500).send(ERROR + ': ' + 'Something broke!');
  }
});

router.get('/', async (req, res) => {
  // send NUM_TWEETS mixed tweets
  try {
    const n = Math.min(realTweetCount, NUM_TWEETS);
    const k = Math.min(fakeTweetCount, getRandomInt(0, n + 1));
    const tweets = await queryTweets(n - k, k);
    res.status(200).json(tweets);
  } catch (err) {
    res.status(500).send(ERROR + ': ' + 'Something broke!');
  }
});


// POST
async function updateAnalytics(tweetData) {
  // Consider using mongoose.Types.ObjectId(...);
  let analytics = tweetData.analytics;
  analytics.correct += tweetData.response; // t:f evaluates to 1:0
  analytics.total += 1;
  // atomically find and update tweet documents
  try {
    let result;
    if (check.isReal(tweetData.answer)) {
      await RealTweet.findByIdAndUpdate(tweetData._id, { analytics });
    } else {
      await FakeTweet.findByIdAndUpdate(tweetData._id, { analytics });
    }
  } catch (err) {
    throw err;
  }
}

router.post('/', async (req, res) => {
  try {
    const requestTweets = req.body;
    await requestTweets.forEach(updateAnalytics);
    res.status(200).json({ result: 'SUCCESS' });
  } catch (err) {
    res.status(500).send(ERROR + ': ' + 'Something broke!');
  }
})

module.exports = router;