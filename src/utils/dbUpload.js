const { RealTweet, FakeTweet, Tweet } = require('../server/models/Tweet');
const enums = require('./enums');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');

// DATE CUTOFF
// Chose arbitrary date pre-election
const EARLIEST_DATE = new Date('2015-01-01 15:40:15');

function save_callback(err, doc) {
  if (err) {
    console.log(err);
  } else {
    // console.log('Successfully saved', doc);
    return;
  }
}

mongoose.connect(
  enums.MONGO_URI(process.env.MONGODB_UN, process.env.MONGODB_PW),
  {useNewUrlParser: true}
)
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
        console.log(row)
        // uncomment below for real_trump_tweets.csv

        let tweet = {
          tweet: row.text,
          metadata: {
            date: (row.created_at? new Date(row.created_at) : Date.now()),
            is_retweet: row.is_retweet || false,
            num_comments: row.comments_count || 0,
            num_retweets: row.retweet_count || 0,
            num_favorites: row.favorite_count || 0,
          }
        };

        // uncomment below for realdonaldtrump.csv
        /*
        let tweet = {
          tweet: row.content,
          metadata: {
            url: row.link,
            date: (row.date? new Date(row.date) : Date.now()),
            is_retweet: row.is_retweet || false,
            num_retweets: row.retweets || 0,
            num_favorites: row.favorites || 0,
          }
        };*/
        if (tweet.metadata.date >= EARLIEST_DATE) {
          if (tweet_type === 'real') {
            tweet.answer ='real';
            const realTweet = new RealTweet(tweet);
            await realTweet.save(save_callback);
          } else {
            tweet.answer = 'fake';
            const fakeTweet = new FakeTweet(tweet);
            await fakeTweet.save(save_callback);
          }
          tweet = new Tweet(tweet);
          await tweet.save(save_callback);
        }
      })
      .on('end', () => {
        console.log('CSV file successfully uploaded.')
      })
  })
  .catch((err) => console.error("MongoDB database not connected. Cannot upload CSV.", err));