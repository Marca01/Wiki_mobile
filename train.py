import random
# from keras.optimizers import SGD
from tensorflow.keras.optimizers import SGD
from keras.layers import Dense, Dropout
from keras.models import load_model
from keras.models import Sequential
import numpy as np
import pickle
import json
import nltk
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()
nltk.download('punkt')
nltk.download('wordnet')

# IMPORT AND LOAD DATA
words = []
classes = []
documents = []
ignore_words = ['?', '!']
data_file = open('./intents.json', encoding='utf-8').read()
intents = json.loads(data_file)

# PREPROCESSING DATA
for intent in intents['intents']:
    for pattern in intent['patterns']:
        # take each word and tokenize it
        w = nltk.word_tokenize(pattern)
        words.extend(w)
        
        # adding documents to the corpus
        documents.append((w, intent['tag']))
        
        # adding classes to our class list
        if intent['tag'] not in classes:
            classes.append(intent['tag'])
            
# lemmatize, lower each word and remove duplicates
words = [lemmatizer.lemmatize(w.lower()) for w in words if w not in ignore_words]
words = sorted(list(set(words)))

# sort classes
classes = sorted(list(set(classes)))
print(len(documents), 'documents') # documents = combination between patterns and intents
print(len(classes), 'classes') # classes = intents
print(len(words), 'unique lemmatized words', words)  # words = all words, vocabulary

pickle.dump(words, open('./words.pkl', 'wb'))
pickle.dump(classes, open('./classes.pkl', 'wb'))
    
# INITIALIZE TRAINING
# initializing training data
training = []
output_emtpy = [0] * len(classes) # create an empty array for our output

# training set, bag of words for each sentence
for doc in documents:
    bag = [] # initialize our bag of words
    pattern_words = doc[0] # list of tokentized words for the patterns
    pattern_words = [lemmatizer.lemmatize(word.lower()) for word in pattern_words] # lemmatize each word - create base word, 
                                                                                   # in attempt to represent related words
    
    # create our bag of words array with 1, if word match found in current pattern
    for w in words:
        bag.append(1) if w in pattern_words else bag.append(0)
        
    # output is a '0' for each tag and '1' for current tag (for each pattern)
    output_row = list(output_emtpy)
    output_row[classes.index(doc[1])] = 1
    
    training.append([bag, output_row])
    
# shuffle our features and turn into np.array
random.shuffle(training)
training = np.array(training)

# create train and test lists: X - patterns, y - intents
train_x = list(training[:, 0])
train_y = list(training[:, 1])
print('Training data created')

# BUILD CHATBOT MODEL
# actual training
model = Sequential() # create 3 layers neural network model (input layer, hidden layer, output layer) using keras Sequential API
model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu')) # input layer with 128 neurons
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu')) # hidden layer with 64 neurons
model.add(Dropout(0.5))
model.add(Dense(len(train_y[0]), activation='softmax')) # output layer contains number of neurons equal to number of intents
                                                        # to predict output intent with softmax
model.summary()

# compile model. Stochastic gradient descent with Nesterov accelerated gradient gives good results for this model
sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

# fitting and saving the model
hist = model.fit(np.array(train_x), np.array(train_y), epochs=250, batch_size=5, verbose=1)
model.save('./chatbot_model.h5', hist)
print('model created')
    
    