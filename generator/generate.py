import os
import sys
import argparse
import cPickle as pickle
import h5py
import random
import numpy as np
import string
from keras.models import model_from_json

from fast import model_from_json as model_from_json_fast
import rhymer
from rhymer import cleanify
import utils

path = os.path.dirname(__file__)

class Generator:
    def __init__(self, model_name='model', fast=False, model=None, verbose=True):
        self.verbose = verbose

        json_file   = os.path.join(path, "model_files", model_name + ".json")
        weight_file = os.path.join(path, "model_files", model_name + ".h5")

        self.debug("Building model...")

        try:
            if model: # We can initialize from a model object if we are running interactively
                self.model = model
            elif fast:
                self.model = model_from_json_fast(open(json_file).read())
            else:
                self.model = model_from_json(open(json_file).read())

            self.debug("Loading weights...")
            self.model.load_weights(weight_file)
        except IOError:
            print 'Error: model `%s` does not exist' % model_name
            sys.exit(1)

        self.debug("Model built.")

        self.batch_size,_,self.n_features = self.model.input_shape
        self.backwards = (model_name in ["model"])

    def debug(self, x):
        if self.verbose:
            print x

    def sample(self, a, temperature=1.0):
        'helper function to sample an index from a probability array'
        a = a.astype('float64').flatten()
        a = np.log(a) / temperature
        a = np.exp(a) / np.sum(np.exp(a))
        return np.argmax(np.random.multinomial(1, a, 1))

    def vectorify(self, sentence):
        'helper function to turn string into LSTM-readable numpy array'
        X = np.zeros((self.batch_size, len(sentence), self.n_features))
        for t,char in enumerate(sentence):
            try:
                X[:, t, utils.char_indices[char]] = 1
                X[:, t, utils.rapper_indices[self._rapper]] = 1
            except KeyError:
                self.debug(char, "not part of model characters")
        return X

    def _add_char(self, char):
        if self.backwards:
            self._generated = char + self._generated
        else:
            self._generated += char

    @property
    def _last_char(self):
        if self.backwards:
            return self._generated[0]
        else:
            return self._generated[-1]

    def _generate_char(self, diversity):
        char = self._last_char
        x = self.vectorify(char)
        preds = self.model.predict(x, batch_size=100)[0]
        next_index = self.sample(preds, diversity)
        next_char = utils.indices_char[next_index]
        self._add_char(next_char)
        return next_char

    def _feed_text(self, feed_text):
        'Feed `feed_text` into model to set internal states'
        if feed_text == ' \n':
            feed_text = 'nigga\n'
        if self.backwards:
            feed_text = feed_text[::-1]

        # first feed last generated character
        if self._generated:
            x = self.vectorify(self._last_char)
            self.model.predict(x, batch_size=100)[0]

        # then feed the text
        for char in feed_text[:-1]:
            x = self.vectorify(char)
            self.model.predict(x, batch_size=100)[0]
            self._add_char(char)

        # don't actually feed in last character because we do that later
        self._add_char(feed_text[-1])

    def _pick_target(self):
        'Find target of rhyme out of `self._generated`'
        lines = self._generated.splitlines()
        the_line = [line for line in lines if line][0] # lol
        last_word = the_line.split()[-1]
        word = ''.join(c for c in last_word if c not in set(string.punctuation))
        return word

    def _empty_line(self):
        second_line = self._generated.splitlines()[1]
        if not second_line or second_line.isspace():
            return True
        else:
            return False

    def _generate_line(self, rhyme, diversity):
        if rhyme:
            target = self._pick_target()
            word = rhymer.pick_rhyme(target)
            self._feed_text(' ' + word)
        while True:
            next_char = self._generate_char(diversity)
            if next_char == '\n':
                line = self._generated.splitlines()[1]
                if not line or line.isspace():
                    continue
                return line

    def generate_generator(self, seed_text='', rapper='Eminem', diversity=0.5, clean=False, 
                           rhyme=True, n_lines=8, **kwargs):
        if rapper == utils.null_rapper:
            rapper = utils.default_rapper
        if rapper not in utils.rappers:
            raise Exception("Rapper not known by model.")
        if seed_text is None:
            seed_text = ''
        # self.model.reset_states()
        self._generated = ""
        self._rapper = rapper
        self._feed_text(' ' + seed_text + '\n')

        if rhyme and not self.backwards:
            self.debug("Warning: rhyming functionality can only be used with backwards models")
            rhyme = False

        for i in range(n_lines):
            rhyme_now = rhyme and i and i % 2
            line = self._generate_line(rhyme_now, diversity)
            line = line.replace("EB", "")
            if clean:
                line = cleanify(line)
            yield line

    def generate(self, *args, **kwargs):
        lines = list(self.generate_generator(*args, **kwargs))
        return '\n'.join(lines[::-1])


if __name__ == '__main__':
    gen = Generator()

    print gen.generate('paid in full', rapper="Dr. Dre")
