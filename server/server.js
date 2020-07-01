const express = require('express');
const mongoose = require('mongoose');
const homeRouter = require('./routes/home');
const tweetsRouter = require('./routes/tweets');
const port = process.env.PORT || 3000;

const uri = "NONE, until further notice";
mongoose.connect(uri, {useNewUrlParser: true})
  .then(async () => {
    console.log('MongoDB database connected...');

    // express app creation
    const app = express();

    // middleware use TODO: auth, JSON, web Tokens

    // routers for api endpoints
    app.use('/', homeRouter);
    app.use('/api/tweets', tweetsRouter);

    app.listen(port, () => console.log(`App listening at port ${port}`));
  })
  .catch((err) => console.error("MongoDB database not connected.", err));
