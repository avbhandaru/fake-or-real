import numpy as np
import random

# Set of all characters in training data.

chars = '\n !"#$%&\'()*+,-./0123456789:;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz{}~®´º½áéñóöō–—―‘’“”…€'

char_indices = dict((c, i) for i, c in enumerate(chars))
indices_char = dict((i, c) for i, c in enumerate(chars))
n_chars = len(chars)

n_features = n_chars

def vectorify(sentence, batch_size):
    # turn a string into LSTM-readable numpy array
    x = np.zeros((batch_size, len(sentence), n_features))
    for t,char in enumerate(sentence):
        x[:, t, char_indices[char]] = 1
    return x

# Simple generate text from seed
def generate(model, seed_text='\n', diversity=0.5, batch_size=None, length=1000):
    if not batch_size:
        raise Exception("Need to specify batch size in order to generate")

    def sample(a):
        # sample an index from a probability array
        a = np.log(a) / diversity
        a = np.exp(a) #/ np.sum(np.exp(a))
        return random.choices(chars, weights=a)[0]
        # return np.argmax(np.random.multinomial(1, a, 1))

    model.reset_states()
    generated = seed_text
    next_char = seed_text

    for i in range(length):
        x = vectorify(next_char, batch_size)
        preds = model.predict(x, verbose=0, batch_size=batch_size)[0]
        next_char = sample(preds)
        generated += next_char

    return generated
