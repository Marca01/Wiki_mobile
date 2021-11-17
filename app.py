import random

import flask
import numpy as np
import pickle
import json
from flask import Flask, request
import nltk
from keras.models import load_model
from nltk.stem import WordNetLemmatizer
from googlesearch import search
import pytesseract
from PIL import Image
import datetime
import wolframalpha
import wikipedia


# wolfram alpha client ID
client = wolframalpha.Client('993EV6-2RT77RVW8V')

lemmatizer = WordNetLemmatizer()

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract'

# Chat initialization
model = load_model('./chatbot_model.h5')
intents = json.loads(open('./intents.json', encoding='utf-8').read())
words = pickle.load(open('./words.pkl', 'rb'))
classes = pickle.load(open('./classes.pkl', 'rb'))

app = Flask(__name__)

@app.route('/')
def home():
    return 'hello from wiki'

# chat
@app.route('/chat', methods=['POST'])
def chatbot_response():
    msg = request.form['msg']
    if msg.startswith('Tôi tên là '):
        name = msg[11:]
        ints = predict_class(msg, model)
        res1 = getResponse(ints, intents, show_details=True)
        res = res1.replace('{n}', name)
        return res
    elif msg.startswith('Xin chào tôi tên là '):
        name = msg[20:]
        ints = predict_class(msg, model)
        res1 = getResponse(ints, intents, show_details=True)
        res = res1.replace('{n}', name)
        return res
    elif 'Lê Văn Kha' in msg:
        res = 'Xin chào chủ nhân của tôi'
        return res
    elif 'Trần Anh Quân' in msg:
        res = 'Xin chào chủ nhân của tôi'
        return res

    # ask time, day, date
    time_ints = predict_class(msg, model)
    time_res = getResponse(time_ints, intents, show_details=True)
    # change day from english to vietnamese
    def change_day(day):
        if day == 'Monday':
            return 'Thứ hai'
        elif day == 'Tuesday':
            return 'Thứ ba'
        elif day == 'Wednesday':
            return 'Thứ tư'
        elif day == 'Thursday':
            return 'Thứ năm'
        elif day == 'Friday':
            return 'Thứ sáu'
        elif day == 'Saturday':
            return 'Thứ bảy'
        elif day == 'Sunday':
            return 'Chủ nhật'

    # ask date
    day = datetime.datetime.now().strftime('%A')
    changed_day = change_day(day)

    if time_ints[0]['intent'] == 'thứ':
        return time_res.replace("{n}", changed_day)
    if time_ints[0]['intent'] == 'ngày':
        return time_res.replace('{n}', datetime.datetime.now().strftime('%d/%m/%Y'))
    if time_ints[0]['intent'] == 'giờ':
        return time_res.replace('{n}', datetime.datetime.now().strftime('%T'))
    if time_ints[0]['intent'] == 'thờigianđầyđủ':
        return time_res.replace('{n}', datetime.datetime.now().strftime(f'{changed_day}, ngày %d tháng %m, %Y, %H giờ %M phút %S giây'.encode('unicode_escape').decode('utf-8')).encode('utf-8').decode('unicode_escape'))

    # calculator
    signs = ['+', '-', '*', 'x', '/', '÷', '(', ')', '!', '=', '^', 'C', 'F']
    calculator_ints = predict_class(msg, model)
    calculator_res = getResponse(calculator_ints, intents, show_details=True)
    # check float number
    def isfloat(num):
        try:
            float(num)
            return True
        except ValueError:
            return False

    # if the user input is text
    if calculator_ints[0]['intent'] == 'tínhtoán':
        lst_patterns = [c for c in nltk.word_tokenize(msg) if c in signs or c.isnumeric() or isfloat(c) or c.startswith('-') and c[1:].isdigit()]
        res = client.query(' '.join(lst_patterns))
        output = next(res.results).text
        return calculator_res.replace('{m}', ' '.join(lst_patterns)).replace('{n}', output)
    else:
        for c in nltk.word_tokenize(msg):
            if c in signs or c.isnumeric() or isfloat(c) or c.startswith('-') and c[1:].isdigit():
                res = client.query(msg)
                output = next(res.results).text
                return output


    # summary search result from wikipedia
    wikipedia.set_lang('vi')
    if 'sum' in msg:
        try:
            rs = wikipedia.summary(msg.replace('sum', ''))
            return rs
        except wikipedia.exceptions.PageError:
            return 'Xin lỗi tôi không tìm thấy kết quả'

    # image to text feature
    vie = 'vie'
    eng = 'eng'
    if msg == ':=totext':
        return flask.redirect(flask.url_for('recognize_vietext_img'), code=307)
    if msg == f':=totext&{eng}':
        return flask.redirect(flask.url_for('recognize_engtext_img'), code=307)

    # google search
    fallback = 'Xin lỗi tôi không tìm thấy kết quả'
    for w in nltk.word_tokenize(msg):
        if w.lower() not in words:
            search_result_list = list(search(msg, lang='vi', num_results=10))
            if len(search_result_list) > 0:
                return str(search_result_list)
            else:
                return fallback
        else:
            ints = predict_class(msg, model)
            res = getResponse(ints, intents, show_details=True)
            return res


# image to text
# @app.route('/recognize', defaults={'lang': 'vie'}, methods=['POST'])
@app.route('/recognize/vie', methods=['POST'])
def recognize_vietext_img():
    image_file = request.files.get('file', '')
    image = Image.open(image_file)
    text = pytesseract.image_to_string(image, lang='vie')
    return text

@app.route('/recognize/eng', methods=['POST'])
def recognize_engtext_img():
    image_file = request.files.get('file', '')
    image = Image.open(image_file)
    text = pytesseract.image_to_string(image, lang='eng')
    return text

@app.route('/botMessages', methods=['GET'])
def chatbot_messages():
    bot_messages = None
    bot_messages = chatbot_response()
    return bot_messages

# chat functionalities
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence) # tokenize the sentence
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words] # lemmatize each word
    return sentence_words

# return bag of words array: 0 or 1 for each word in the bag that exists in the sentence
def bow(sentence, words, show_details=True):
    # tokenize the pattern
    sentence_words = clean_up_sentence(sentence)

    # bag of words - matrix of N words, vocabulary matrix
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w, in enumerate(words):
            if w == s:
                # assign 1 if current word is in the vocabulary position
                bag[i] = 1
                if show_details:
                    print(f'found in bag {w}')
    return np.array(bag)

# predict
def predict_class(sentence, model):
    p = bow(sentence, words, show_details=False)
    res = model.predict(np.array([p]))[0] # generate probabilities from the model
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD] # filter out predictions below a threshold

    results.sort(key=lambda x: x[1], reverse=True) # sort by strength of probability
    return_list = []
    for r in results:
        return_list.append({'intent': classes[r[0]], 'probability': str(r[1])})
    return return_list

# result = ''
def getResponse(ints, intents_json, userID='123', show_details=False):
    result_context = None
    context = {} # create a data structure to hold user context

    tag = ints[0]['intent']
    list_of_intents = intents_json['intents']

    if ints:
        while ints:
            for i in list_of_intents:
                if i['tag'] == tag:
                    # set context for this intent if necessary
                    result_context = random.choice(i['responses'])
                    if 'context' in i:
                        if show_details: print('context: ', i['context'])
                        context[userID] = i['context']

                        # check if this intent is contextual and applies to this user's conversation]
                    if not 'context_filter' in i or (userID in context and 'context_filter' in i and i['context_filter'] == context[userID]):
                        if show_details: print('tag: ', i['tag'])
                        return random.choice(i['responses'])          # random response from the intent
            return result_context
    # tag = ints[0]['intent']
    # list_of_intents = intents_json['intents']
    # for i in list_of_intents:
    #     if i['tag'] == tag:
    #         result = random.choice(i['responses'])
    # return result


if __name__ == "__main__":
    app.run(debug=True)