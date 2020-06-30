const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

const uri = "mongodb+srv://akhil:r0Lx2SwPS02VF6IN@real-or-fake.aqihu.mongodb.net/fake-or-real?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true})
  .then(async () => {
    console.log('MongoDB database connected...');

    // For now
    const schema = mongoose.Schema({
      name: String
    });
    Name = mongoose.model('Name', schema);
    const name1 = new Name({
      name: 'kenny'
    });
    const name2 = new Name({
      name: 'jeffrey'
    });
    const name3 = new Name({
      name: 'trump'
    });
    await name1.save();
    await name2.save();
    await name3.save();

    const app = express();
    app.listen(port, () => console.log(`Example app listening at port ${port}`));

    app.get('/', (req, res) => {
      res.send('Hello World!')
    });
    
    app.get('/api/tweets', async (req, res) => {
      const tweets = await Name.find();
      res.send(tweets);
      // remote call to get tweets from DB
    });
  })
  .catch((err) => console.error("MongoDB database not connected.", err));
// db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open',)



// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://akhil:r0Lx2SwPS02VF6IN@real-or-fake.aqihu.mongodb.net/fake-or-real?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
