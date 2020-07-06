// dataset_1 has csv column headers:
// source , text , created_at , retweet_count , favorite_count , is_retweet , id_str
module.exports = entry => {
  return {
    id: entry.id_str,

    // Model fields
    tweet: entry.text,
    answer: 'real',
    metadata: {
      author: 'Donald J. Trump',
      handle: 'realDonaldTrump',
      date: entry.created_at? new Date(entry.created_at) : Date.now(),
      is_retweet: entry.is_retweet || false,
      num_comments: 0, // NONE
      num_retweets: entry.retweet_count,
      num_favorites: entry.favorite_count
    }
    // analytics are set as default
  }
}
