const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser);

const server = app.listen(process.env.PORT || 8080, () => {
  var port = server.address().port;
  console.log("App now running on port", port);
});

// GET tweets
app.get('/api/tweets', (req, res) => {
  let tweets = ['a', 'b', 'c', 'd', 'e'];
  res.status(200).json(tweets);
});