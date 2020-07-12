# fake-or-real
Check out our live site at:

http://fake-or-real.s3-website-us-west-1.amazonaws.com/

## About
TODO

## Technologies
TODO

## API
All API requests should point towards our fixed endpoint https://fake-or-real.herokuapp.com/api/tweets. Our server supports the following types of HTTP requests:
 - GET
 - POST
The API can easily be explored via postman, or through standard `curl | fetch | ajax` calls. The following are information regarding request and response schemas, along with route information:

### `GET`
Three routes are supported by our server. Note that the response body will be a list of tweet objects; the tweet object is described following the routes:
 - `api/tweets`: response is a list of `50` tweet objects, composed of `50 - k` real tweets and `k` (where `k` is random) fake tweets.
 - `api/tweets/:n`: response is a list of `n` tweet objects, composed of `n - k` real tweets and `k` (where `k` is random) fake tweets.
 - `api/tweets/:n/:k`: response is a list of `n + k` tweet objects, composed of `n` real tweets and `k` fake tweets.

The tweet object follows the format below:
```js
{
  _id: String, // These will be mongoose.Types.ObjectId's
	tweet: String, // tweet content
	answer: Enum('real' | 'fake'),
	metadata: {
		author: String,
		handle: String,
		url: String,
		date: Date,
		is_retweet: Boolean,
		num_comments: Number,
		num_retweets: Number,
		num_favorites: Number		
	},
	analytics: {
		correct: Number,
		total: Number
	}
}
```

Our API's HTTP:GET response will have the following form (written below as js, but response in JSON):
```js
[
  tweet_object_1,
  tweet_object_2,
  ...
]
```

### `POST`
One route is currently supported by our server. This is used internally for analytics and improving our fake tweet generation tooling/models. More routes will be added in the future depending on need or opportunity!
 - `api/tweets`: response is a result object

The request body should have the following form (where `correct` means how many times users have classified this tweet correctly, and `total` is self-explanatory):
```JSON
[
  {
    "_id": "5f06c8063db943155528f045",
    "answer": "fake",
    "response": true,
    "analytics": {
      "correct": 8,
      "total": 10
    }
  },
  {
    "_id": "5f06c8063db943155528f046",
    "answer": "fake",
    "response": true,
    "analytics": {
      "correct": 6,
      "total": 10
    }
  },
  ...
]
```

The result of this request will be an update of the tweet analytics sub-object of the tweet object currently in the database. These updates (increasing the `analytics.correct` and `analytics.total` fields) are atomic. The response will be a `500` error, or the following simple (subject to change) json:

```JSON
{
  "result": "SUCCESS"
}
```

## Uploading Tweet CSV's
If you decide to clone this repository, the following modules are useful for cleaning/filtering and uploading your own tweets/tweet data into your database:
 - `data/filter.js`
 - `src/utils/upload.js`

Each have `yargs` support and typing `./data/filter.js --help` or `./src/utils/upload.js --help` will return usage information. Regardless, below is a sample of how you might use these modules in succession (note that `source env.sh` can be replaced with exporting the necessary environment variables for MongoDB connection):
```shell
./data/filter.js -d data/dataset_1.csv -s data/dataset_1.scheme.js -o output.csv
source env.sh && ./src/utils/upload.js -d data/output.csv
```

## Authors
Hope this is helpful and try out our game!

Yours truly,
  JAK
