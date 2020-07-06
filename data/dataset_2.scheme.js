// dataset_2 has csv column headers:
// id , link , content , date , retweets , favorites , mentions , hashtags
module.exports = entry => {
  return {
    id: entry.id,

    // Model fields
    tweet: entry.content,
    answer: 'real',
    metadata: {
      author: 'Donald J. Trump',
      handle: 'realDonaldTrump',
      url: entry.link,
      date: entry.date? new Date(entry.date) : Date.now(),
      is_retweet: false, // NONE
      num_comments: entry.mentions,
      num_retweets: entry.retweets,
      num_favorites: entry.favorites
    }
    // analytics are set as default
  }
}
