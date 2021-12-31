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
from pyowm import OWM
from pyowm.utils.config import get_default_config
import requests
from bs4 import BeautifulSoup
from base64 import b64encode
import io
import os
import holidayapi
from dotenv import load_dotenv
load_dotenv()

from recommender import make_recommendation, movieGenres

# SECRET_KEYS
WOLFRAMALPHA_APPID = os.getenv('WOLFRAMALPHA_APPID')
OPENWEATHERMAP_APIKEY = os.getenv('OPENWEATHERMAP_APIKEY')

# wolfram alpha client ID
client = wolframalpha.Client(WOLFRAMALPHA_APPID)

lemmatizer = WordNetLemmatizer()

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract'

# Chat initialization
model = load_model('./chatbot_model.h5')
intents = json.loads(open('./intents.json', encoding='utf-8').read())
words = pickle.load(open('./words.pkl', 'rb'))
classes = pickle.load(open('./classes.pkl', 'rb'))

app = Flask(__name__)
app.config['ENV'] = 'development'
app.config['DEBUG'] = True
app.config['TESTING'] = True

@app.route('/')
def home():
    return 'hello from wiki'

# chat
@app.route('/chat', methods=['POST'])
def chatbot_response():
    msg = request.form['msg']
    
    # get tag 'giớithiệu' patterns
    patterns = intents['intents'][4]['patterns']
    intro_ints = predict_class(msg, model)
    intro_res = getResponse(intro_ints, show_details=True)

    if intro_ints[0]['intent'] == 'giớithiệu':
        for pattern in patterns:
            if msg.find(pattern) > -1:
                return intro_res.replace('{n}', msg.replace(pattern, ''))

    elif 'Lê Văn Kha' in msg:
        res = 'Xin chào chủ nhân của tôi'
        return res
    elif 'Trần Anh Quân' in msg:
        res = 'Xin chào chủ nhân của tôi'
        return res

    # ask time, day, date
    time_ints = predict_class(msg, model)
    time_res = getResponse(time_ints, show_details=True)
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
        return time_res.replace('{n}', datetime.datetime.now().strftime(f'{changed_day}, ngày %d tháng %m năm %Y, %H giờ %M phút %S giây'.encode('unicode_escape').decode('utf-8')).encode('utf-8').decode('unicode_escape'))

    # calculator
    signs = ['+', '-', '*', 'x', '/', '÷', '(', ')', '!', '=', '^', 'C', 'F']
    calculator_ints = predict_class(msg, model)
    calculator_res = getResponse(calculator_ints, show_details=True)
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
        if isfloat(output):
            return calculator_res.replace('{m}', ' '.join(lst_patterns)).replace('{n}', str(round(float(output), 5)))
        else:
            return calculator_res.replace('{m}', ' '.join(lst_patterns)).replace('{n}', output)
    else:
        for c in nltk.word_tokenize(msg):
            if c in signs or c.isnumeric() or isfloat(c) or c.startswith('-') and c[1:].isdigit():
                res = client.query(msg)
                output = next(res.results).text
                return output


    # summary search result from wikipedia
    wikipedia.set_lang('vi')
    if ':wiki' in msg:
        try:
            rs = wikipedia.summary(msg.replace(':wiki', '').strip())
            return rs
        except wikipedia.exceptions.PageError:
            return 'Xin lỗi tôi không tìm thấy kết quả'

    # image to text feature
    vie = 'vie'
    eng = 'eng'
    if msg == ':totext':
        return flask.redirect(flask.url_for('recognize_vietext_img'), code=307)
    if msg == f':totext&{eng}':
        return flask.redirect(flask.url_for('recognize_engtext_img'), code=307)

    # google search
    fallback = 'Xin lỗi, tôi không tìm thấy kết quả'
    if ':search' in msg:
        search_result_list = list(search(msg.replace(':search', '').strip(), lang='vi', num_results=10))
        if len(search_result_list) > 0:
            return json.dumps(search_result_list)
        else:
            return fallback

    # ask weather
    config_dict = get_default_config()
    config_dict['language'] = 'vi'
    owm = OWM(OPENWEATHERMAP_APIKEY)
    mgr = owm.weather_manager()

    weather_ints = predict_class(msg, model)
    weather_res = getResponse(weather_ints, show_details=True)
    if weather_ints[0]['intent'] == 'thờitiết':
        observation = mgr.weather_at_place('Đà Nẵng')
        w = observation.weather
        weather_info = weather_res.replace('{status}', w.detailed_status).replace('{icon}', w.weather_icon_url()).replace('{temp}', str(w.temperature('celsius')['temp'])).replace('{max}', str(w.temperature('celsius')['temp_max'])).replace('{min}', str(w.temperature('celsius')['temp_min'])).replace('{feel}', str(w.temperature('celsius')['feels_like'])).replace('{humidity}', str(w.humidity)).replace('{pressure}', str(w.pressure["press"])).replace('{visibility}', str(w.visibility_distance/1000))
        return weather_info


    # fun stories/quotes
    URL = 'https://elead.com.vn/nhung-cau-noi-hai-nao-khien-ban-cuoi-nghieng-nga-hay-nhat'
    requestt = requests.get(URL)
    content = requestt.content
    soup = BeautifulSoup(content, 'lxml')

    # Extract data of books
    quotes = []
    quot = []
    quote_data = soup.find_all('blockquote', class_='wp-block-quote')
    for i in range(len(quote_data)):
        for quote in quote_data[i].find_all('p'):
            quotes.append(quote.text.replace('-', '').replace('– ', '').replace('+ ', ''))

    for quote in quotes:
        quo = ''.join([w for w in quote if not w.isdigit()]).replace('.', '', 1)
        quo = quo.split('.')
        quo = [q for q in quo if q]
        quo = '.'.join(quo).strip()
        quot.append(quo)

    # joke
    funstr_ints = predict_class(msg, model)
    funstr_res = getResponse(funstr_ints, show_details=True)
    if funstr_ints[0]['intent'] == 'đùa':
        return funstr_res.replace('{joke}', random.choice(quot))

    # continue the joke
    jokeCon_ints = predict_class(msg, model)
    jokeCon_res = getResponse(jokeCon_ints, show_details=True)
    if jokeCon_ints[0]['intent'] == 'đùatiếp':
        return jokeCon_res.replace('{joke}', random.choice(quot))

    # joke again
    jokeAgain_ints = predict_class(msg, model)
    jokeAgain_res = getResponse(jokeAgain_ints, show_details=True)
    if jokeAgain_ints[0]['intent'] == 'đùalại':
        return jokeAgain_res.replace('{joke}', random.choice(quot))

    # bored
    bored_ints = predict_class(msg, model)
    bored_res = getResponse(bored_ints, show_details=True)
    if bored_ints[0]['intent'] == 'chán':
        return bored_res.replace('{n}', random.choice(quot))

    # still bored
    stillbored_ints = predict_class(msg, model)
    stillbored_res = getResponse(stillbored_ints, show_details=True)
    if stillbored_ints[0]['intent'] == 'vẫnchán':
        return stillbored_res.replace('{n}', random.choice(quot))

    # appease
    URL2 = 'https://vinapool.vn/tin-tuc/nhung-cau-noi-an-ui-dong-vien-khich-le-tinh-than-ban-be'
    requestt2 = requests.get(URL2)
    content2 = requestt2.content
    soup2 = BeautifulSoup(content2, 'lxml')

    # Extract data of appeasement
    sentences = soup2.find('h2')
    bunch_of_sentences = sentences.find_next_siblings('p')
    only_appeasement = [i.text for i in bunch_of_sentences]
    rs = []

    for s in only_appeasement:
        not_num_st = ''.join([w for w in s if not w.isdigit()]).replace('.', '', 1)
        not_num_st = not_num_st.split('.')
        not_num_st = [ss for ss in not_num_st if ss]
        rs.append('.'.join(not_num_st))

    lst = [sen.strip() for sen in rs if sen]
    response_appeasement = lst[:53]

    # appease
    appease_ints = predict_class(msg, model)
    appease_res = getResponse(appease_ints, show_details=True)
    if appease_ints[0]['intent'] == 'lờianủi':
        return appease_res.replace('{n}', random.choice(response_appeasement))

    # recommendation
    if ':movie' in msg:
        # return 'Được rồi bắt đầu thôi'
        # get_genres(msg)
        # get_actors(msg)
        # get_directors(msg)
        # get_keywords(msg)
        if msg.replace(':movie', '').strip() in movieGenres:
            return json.dumps(make_recommendation(msg.replace(':movie', '').strip()))
        else:
            return 'Xin lỗi, tôi không tìm thấy phim nào phù hợp với thể loại này'

    # if don't understand words
    for w in nltk.word_tokenize(msg):
        if w.lower() not in words:
            return 'Xin lỗi, tôi không hiểu bạn đang nói gì cả'
        else:
            ints = predict_class(msg, model)
            res = getResponse(ints, show_details=True)
            return res

# image to text
# @app.route('/recognize', defaults={'lang': 'vie'}, methods=['POST'])
@app.route('/recognize/vie', methods=['POST'])
def recognize_vietext_img():
    image_file = request.files.get('file')
    image = Image.open(image_file)
    text = pytesseract.image_to_string(image, lang='vie')
    # base64 image
    byte_image = io.BytesIO()
    image.save(byte_image, format='PNG')
    byte_image_value = byte_image.getvalue()
    base64_image = b64encode(byte_image_value)
    return json.dumps({'image': str(base64_image.decode('utf-8')), 'text': text}, ensure_ascii=False)

@app.route('/recognize/eng', methods=['POST'])
def recognize_engtext_img():
    image_file = request.files.get('file')
    image = Image.open(image_file)
    text = pytesseract.image_to_string(image, lang='eng')
    # base64 image
    byte_image = io.BytesIO()
    image.save(byte_image, format='PNG')
    byte_image_value = byte_image.getvalue()
    base64_image = b64encode(byte_image_value)
    return json.dumps({'image': str(base64_image.decode('utf-8')), 'text': text}, ensure_ascii=False)

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


context = {} # create a data structure to hold user context

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

# response to user
def getResponse(ints, userID='123', show_details=False):
    result_context = None

    tag = ints[0]['intent']
    list_of_intents = intents['intents']

    if ints:
        while ints:
            for i in list_of_intents:
                if i['tag'] == tag:
                    # set context for this intent if necessary
                    if 'context' in i:
                        if show_details: print('context: ', i['context'])
                        context[userID] = i['context']

                    # check if this intent is contextual and applies to this user's conversation]
                    if not 'context_filter' in i or (userID in context and 'context_filter' in i and i['context_filter'] == context[userID]):
                        if show_details: print('tag: ', i['tag'])
                        return random.choice(i['responses'])  # random response from the intent

            # ints.pop(0)
            return 'Xin lỗi, tôi không hiểu bạn đang nói gì cả'

if __name__ == "__main__":
    app.run(debug=True)