const mongoose = require('mongoose');

// Consider sub-documents vs nested layer if we add a Tweets collection
const schema = mongoose.Schema({
  tweet: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280
  },
  answer: {
    type: String,
    required: true,
    enum: ['real', 'fake'],
  },
  metadata: {
    // if no author/handle -> default Donald J. Trump and @realDonaldTrump
    author: {
      type: String,
      minlength: 1,
      maxlength: 32,
      required: true,
      default: 'Donald J. Trump' },
    handle: {
      type: String,
      minlength: 1,
      maxlength: 32,
      required: true,
      default: 'realDonaldTrump' },
    date: { type: Date, required: true, default: Date.now() },
    is_retweet: { type: Boolean , default: false },
    num_comments: { type: Number, min: 0, default: 0 },
    num_retweets: { type: Number, min: 0, default: 0 },
    num_favorites: { type: Number, min: 0, default: 0 }
  },
  analytics: {
    correct_guesses: { type: Number, min: 0, default: 0 },
    incorrect_guesses: { type: Number, min: 0, default: 0 }
  }
});

module.exports = {
  RealTweet: mongoose.model('RealTweet', schema),
  FakeTweet: mongoose.model('FakeTweet', schema),
  Tweet: mongoose.model('Tweet', schema)
}

