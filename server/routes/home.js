const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// routes
router.get('', (req, res) => {
  res.send('This is the home page!');
})

module.exports = router;