const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 32
  },
  handle: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 32
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  comments: {
    type: Number,
    min: 0,
    default: 0
  },
  is_retweet: Boolean,
  retweets: {
    type: Number,
    min: 0,
    default: 0
  },
  hearts: {
    type: Number,
    min: 0,
    default: 0
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now()
  },
  is_real: {
    type: Boolean,
    required: true,
  },
  // for analytics later
  guesses: {
    correct_guesses: {
      type: Number,
      min: 0,
      default: 0
    },
    incorrect_guesses: {
      type: Number,
      min: 0,
      default: 0
    }
  }
});

module.exports = {
  RealTweet: mongoose.model('RealTweet', schema),
  FakeTweet: mongoose.model('FakeTweet', schema),
  Tweet: mongoose.model('Tweet', schema)
}

