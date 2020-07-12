from keras.models import Sequential
from keras.models import model_from_json
from keras.layers.core import Dense, Activation, Dropout
from keras.layers.recurrent import LSTM
from keras.callbacks import Callback
from keras.optimizers import Adam
from itertools import islice
import numpy as np
import random

import utils
import load_data

val_split = 0.05 # proportion of data used for validation
nb_epoch   = 100  # num of epochs to train for
batch_size = 100 # X.shape[0]
maxlen     = 100 # X.shape[1] (Number of steps to back propogate through time)
n_features_in = utils.n_features
n_features_out = utils.n_chars
step       = 1

training, val = load_data.load_data(val_split, batch_size, maxlen, step)
training_batches,training_samples = training
val_batches,val_samples = val

class callback(Callback):
    def __init__(self, offset=0):
        self.offset = offset

    def on_batch_end(self, batch, logs={}):
        # This allows us to learn longer term dependencies!
        reset_freq = 100
        if (batch % reset_freq) == 0:
            model.reset_states()

    def on_epoch_begin(self, epoch, logs={}):
        print('Epoch %d: ' % epoch)
        model.reset_states()

    def on_epoch_end(self, epoch, logs={}):
        epoch += self.offset
        model.save_weights('checkpoints/model_weights_%d.h5' % epoch, overwrite=True)

        # val_loss = logs['val_loss']

        # write some sample generated text

        diversities = [0.2, 0.5, 0.7, 1.0]
        generateds = [utils.generate(model, seed_text, diversity, batch_size) 
                for diversity in diversities]

        print(generateds[1])
        print('\n' % epoch)

        filename = 'checkpoints/epoch_%d_gen.txt' % epoch
        with open(filename, 'w') as f:
            f.write('----- Epoch number %d\n' % epoch)
            #f.write('-- Validation loss: %0.6f\n' % val_loss)

            for generated,diversity in zip(generateds, diversities):
                f.write('----- diversity: %0.1f\n' % diversity)
                f.write(generated + '\n\n\n\n')

print('Building model...' )
model = Sequential()
model.add(LSTM(300, return_sequences=True, stateful=True,
        batch_input_shape=(batch_size, None, n_features_in)))
model.add(Dropout(0.5))
model.add(LSTM(300, return_sequences=False, stateful=True))
model.add(Dropout(0.5))
model.add(Dense(n_features_out))
model.add(Activation('softmax'))
model.compile(loss='categorical_crossentropy', optimizer=Adam())

model.summary()

print('Training model...' )
hist = model.fit(x=training_batches, epochs=nb_epoch, 
        steps_per_epoch=(training_samples/10), callbacks=[callback()], #validation_data=val_batches, nb_val_samples=val_samples)
        )
