#!/usr/bin/python3

# import yaml
import re
import pandas
from textgenrnn import textgenrnn

import tensorflow as tf

physical_devices = tf.config.experimental.list_physical_devices('GPU')
config = tf.config.experimental.set_memory_growth(physical_devices[0], True)


num_epochs = 5
gen_epochs = 1
batch_size = 256
train_size = 1.0
new_model = True

rnn_layers = 2
rnn_size = 128
rnn_bidirectional = False
max_length = 40
dim_embeddings = 100
word_level = True

def process_tweet_text(text):
    text = re.sub(r'http\S+', '', text)   # Remove URLs
    text = re.sub(r'@[a-zA-Z0-9_]+', '', text)  # Remove @ mentions
    text = text.strip(" ")   # Remove whitespace resulting from above
    text = re.sub(r' +', ' ', text)   # Remove redundant spaces

    # Handle common HTML entities
    text = re.sub(r'&lt;', '<', text)
    text = re.sub(r'&gt;', '>', text)
    text = re.sub(r'&amp;', '&', text)
    return text


# with open("config.yml", "r") as f:
#     cfg = yaml.load(f)

# auth = tweepy.OAuthHandler(cfg['consumer_key'], cfg['consumer_secret'])
# auth.set_access_token(cfg['access_key'], cfg['access_secret'])

# api = tweepy.API(auth)

texts = []
context_labels = []

df = pandas.read_csv('dataset_2.filtered.csv')
for tweet in df['tweet']:
    text = process_tweet_text(tweet)
    if text is not '':
        texts.append(text)
        context_labels.append('realDonaldTrump')

# for user in cfg['twitter_users']:
#     print("Downloading {}'s Tweets...".format(user))
#     all_tweets = tweepy.Cursor(api.user_timeline,
#                                screen_name=user,
#                                count=200,
#                                tweet_mode='extended',
#                                include_rts=False).pages(16)
#     for page in all_tweets:
#         for tweet in page:
#             tweet_text = process_tweet_text(tweet.full_text)
#             if tweet_text is not '':
#                 texts.append(tweet_text)
#                 context_labels.append(user)

textgen = textgenrnn(name='fakeDonaldTrump')

if new_model:
    textgen.train_new_model(
        texts,
        context_labels=context_labels,
        num_epochs=num_epochs,
        gen_epochs=gen_epochs,
        batch_size=batch_size,
        train_size=train_size,
        rnn_layers=rnn_layers,
        rnn_size=rnn_size,
        rnn_bidirectional=rnn_bidirectional,
        max_length=max_length,
        dim_embeddings=dim_embeddings,
        word_level=word_level)
else:
    textgen.train_on_texts(
        texts,
        context_labels=context_labels,
        num_epochs=num_epochs,
        gen_epochs=gen_epochs,
        train_size=train_size,
        batch_size=batch_size)
