const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const enums = require('../enums/enums');
const homeRouter = require('./routes/home');
const tweetsRouter = require('./routes/tweets');
const port = process.env.PORT || 3000;

mongoose.connect(
  enums.MONGO_URI(process.env.MONGODB_UN, process.env.MONGODB_PW),
  {
    useNewUrlParser: true,
    useFindAndModify: false
  }
)
  .then(async () => {
    console.log('MongoDB database connected...');

    // express app creation
    const app = express();

    // middleware use TODO: auth, JSON, web Tokens
    app.use(bodyParser.json());

    // Uncomment below if running site dynamically
    // app.use(express.static('public'));

    // routers for api endpoints
    app.use('/', homeRouter);
    app.use('/api/tweets', tweetsRouter);

    app.listen(port, () => console.log(`App listening at port ${port}`));
  })
  .catch((err) => console.error("MongoDB database not connected.", err));
