const { RealTweet, FakeTweet, Tweet } = require('../server/models/Tweet');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');

function save_callback(err, doc) {
  if (err) {
    console.log(err);
  } else {
    console.log('Successfully saved', doc);
  }
}

const uri = "mongodb+srv://akhil:r0Lx2SwPS02VF6IN@real-or-fake.aqihu.mongodb.net/fake-or-real?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true})
  .then(async () => {
    console.log('MongoDB database connected. Attempting to upload CSV...');

    // read in csv
    let args = process.argv.slice(2);
    if (args.length > 2) {
      console.error('Extraneous arguments given. Only path to CSV accepted.');
      process.abort();
    }
    tweet_csv_path = args[0];
    tweet_type = args[1];
    await fs.createReadStream(tweet_csv_path)
      .pipe(csv())
      .on('data', async (row) => {
        // console.log(row)
        let name = row.name || 'Donald J. Trump';
        let handle = row.handle || 'realDonaldTrump';
        let tweet = {
          name: name,
          handle: handle,
          content: row.text,
          is_retweet: row.is_retweet || false,
          retweets: row.retweet_count || 0,
          hearts: row.favorite_count || 0,
          created_at: (row.created_at? new Date(row.created_at) : Date.now())
        }
        if (tweet_type === 'real') {
          tweet.is_real = true;
          const realTweet = new RealTweet(tweet);
          await realTweet.save(save_callback);
        } else {
          tweet.is_real = false;
          const fakeTweet = new FakeTweet(tweet);
          await fakeTweet.save(save_callback);
        }
        tweet = new Tweet(tweet);
        await tweet.save(save_callback);
      })
      .on('end', () => {
        console.log('CSV file successfully uploaded.')
      })
  })
  .catch((err) => console.error("MongoDB database not connected. Cannot upload CSV.", err));