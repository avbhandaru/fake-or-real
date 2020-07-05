const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// routes
router.get('', (req, res) => {
  // Look to potentially send top 5 fake tweets that people vote to be real
  // res.send('This is the home page! This is the tweets api! [HELP] /api/tweets/:n, /api/tweets/:n/:k to decide how mant real and fake quotes you want!');
  res.send('Please checkout the client facing site: http://fake-or-real.s3-website-us-west-1.amazonaws.com/index.html');
})

module.exports = router;