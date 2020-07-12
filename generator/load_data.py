import random
import os
import numpy as np
from itertools import islice
from collections import namedtuple

import utils

def load_data(val_split, batch_size, maxlen, step):
    # Returns two tuples of (batch generator, number of samples)
    # The first one is training, the second one is validation
    file_path = '../data/dataset_2_short.raw.csv'
    text = open(file_path).read()
    tweets = text.split('\n')

    random.seed(69)
    random.shuffle(tweets)
    text =  ''.join(tweets)

    training_text = text[:int(len(text) * (1-val_split))]
    val_text      = text[int(len(text) * (1-val_split)):]

    # num of samples has to be multiple of batch_size
    training_samples = int((len(training_text) - maxlen - 1) / step)
    training_samples = batch_size * int(training_samples / batch_size)
    val_samples      = int((len(val_text) - maxlen - 1) / step)
    val_samples      = batch_size * int(val_samples / batch_size)

    def make_sentences(text):
        for i in range(0, len(text) - maxlen, step):
            sentence  = text[i: i + maxlen]
            next_char = text[i + maxlen]
            yield sentence,next_char

    def make_batches(text):
        while True:
            all_sentences = make_sentences(text)
            while True:
                try:
                    sentences,next_chars = zip(*islice(all_sentences, 0, batch_size))
                    if len(sentences) != batch_size:
                        raise ValueError("Not enough samples left")
                except ValueError:
                    break #epoch finished

                X = np.zeros((batch_size, maxlen, utils.n_features), dtype=np.bool)
                y = np.zeros((batch_size, utils.n_chars), dtype=np.bool)
                for i,sentence in enumerate(sentences):
                    for t,char in enumerate(sentence):
                        X[i, t, utils.char_indices[char]] = 1
                for i,next_char in enumerate(next_chars):
                    y[i, utils.char_indices[next_char]] = 1
                yield X,y

    training_batches = make_batches(training_text)
    val_batches      = make_batches(val_text)

    return (training_batches,training_samples),(val_batches,val_samples)
