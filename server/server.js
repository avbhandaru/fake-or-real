const PORT = process.env.PORT || 8000;
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser);

// GET tweets
app.get('/api/tweets', (req, res) => {
  let tweets = ['a', 'b', 'c', 'd', 'e'];
  res.status(200).send(tweets);
});

// LISTEN
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});