const express = require('express');
const port = process.env.PORT || 3000;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/api/tweets', (req, res) => {
  res.send(JSON.stringify([1, 2, 3, 4, 5]))
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});