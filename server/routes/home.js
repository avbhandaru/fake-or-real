const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// routes
router.get('', (req, res) => {
  res.send('This is the home page! This is the tweets api! [HELP] /api/tweets/:n, /api/tweets/:n/:k to decide how mant real and fake quotes you want!');
})

module.exports = router;