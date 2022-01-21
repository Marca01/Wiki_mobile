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
RAPIDAPI_URLSHORTENER_KEY = os.getenv('RAPIDAPI_URLSHORTENER_KEY')
RAPIDAPI_CURRENCYCONVERTER_KEY = os.getenv('RAPIDAPI_CURRENCYCONVERTER_KEY')

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
    not_recognize_words = nltk.word_tokenize(msg)

    # get tag 'giớithiệu' patterns
    patterns = intents['intents'][6]['patterns']
    for w in not_recognize_words:
        if w.lower() in words:

            # predict message
            ints = predict_class(msg, model)
            if not ints:
                return 'Xin lỗi, Wiki không hiểu bạn đang nói gì cả'
            else:

                intro_ints = predict_class(msg, model)
                intro_res = getResponse(intro_ints, show_details=True)

                if intro_ints[0]['intent'] == 'giớithiệu':
                    for pattern in patterns:
                        if msg.find(pattern) > -1:
                            return intro_res.replace('{n}', msg.replace(pattern, ''))

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
                    return time_res.replace('{n}', datetime.datetime.now().strftime(
                        f'{changed_day}, ngày %d tháng %m năm %Y, %H giờ %M phút %S giây'.encode(
                            'unicode_escape').decode(
                            'utf-8')).encode('utf-8').decode('unicode_escape'))

                # day session
                def day_time(time):
                    if (int(time) > 4) and (int(time) <= 8):
                        return 'Sáng sớm'
                    elif (int(time) > 8) and (int(time) <= 11):
                        return 'Sáng'
                    elif (int(time) > 11) and (int(time) <= 14):
                        return 'Trưa'
                    elif (int(time) > 14) and (int(time) <= 18):
                        return 'Chiều'
                    elif (int(time) > 18) and (int(time) <= 22):
                        return 'Tối'
                    elif (int(time) > 22) and (int(time) <= 24):
                        return 'Đêm'
                    elif (int(time) <= 4):
                        return 'Khuya'

                t = datetime.datetime.now().strftime('%H')
                session = day_time(t)

                session_ints = predict_class(msg, model)
                session_res = getResponse(session_ints, show_details=True)

                morning_ressponse = intents['intents'][8]['responses']
                noon_ressponse = intents['intents'][10]['responses']
                afternoon_ressponse = intents['intents'][12]['responses']
                night_ressponse = intents['intents'][14]['responses']

                if session_ints[0]['intent'] == 'chàobuốisáng':
                    if session == 'Trưa':
                        return random.choice(noon_ressponse).replace('{time}', t)
                    if session == 'Chiều':
                        return random.choice(afternoon_ressponse).replace('{time}', t)
                    if session == 'Tối' or session == 'Đêm' or session == 'Khuya':
                        return random.choice(night_ressponse).replace('{time}', t)

                    return session_res

                if session_ints[0]['intent'] == 'chàobuốitrưa':
                    if session == 'Sáng' or session == 'Sáng sớm':
                        return random.choice(morning_ressponse).replace('{time}', t)
                    if session == 'Chiều':
                        return random.choice(afternoon_ressponse).replace('{time}', t)
                    if session == 'Tối' or session == 'Đêm' or session == 'Khuya':
                        return random.choice(night_ressponse).replace('{time}', t)

                    return session_res

                if session_ints[0]['intent'] == 'chàobuốichiều':
                    if session == 'Sáng' or session == 'Sáng sớm':
                        return random.choice(morning_ressponse).replace('{time}', t)
                    if session == 'Trưa':
                        return random.choice(noon_ressponse).replace('{time}', t)
                    if session == 'Tối' or session == 'Đêm' or session == 'Khuya':
                        return random.choice(night_ressponse).replace('{time}', t)

                    return session_res

                if session_ints[0]['intent'] == 'chàobuốitối':
                    if session == 'Sáng' or session == 'Sáng sớm':
                        return random.choice(morning_ressponse).replace('{time}', t)
                    if session == 'Trưa':
                        return random.choice(noon_ressponse).replace('{time}', t)
                    if session == 'Chiều':
                        return random.choice(afternoon_ressponse).replace('{time}', t)

                    return session_res

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
                APPEASE_URL = 'https://vinapool.vn/tin-tuc/nhung-cau-noi-an-ui-dong-vien-khich-le-tinh-than-ban-be'
                appease_request = requests.get(APPEASE_URL)
                content2 = appease_request.content
                appease_soup = BeautifulSoup(content2, 'lxml')

                # Extract data of appeasement
                sentences = appease_soup.find('h2')
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

                # MAIN FEATURES
                # ===============================================================================================================
                # google search ========================================
                fallback = 'Xin lỗi, Wiki không tìm thấy kết quả'
                google_ints = predict_class(msg, model)
                if google_ints[0]['intent'] == 'searchgoogle':
                    search_result_list = list(search(msg.replace(':google', '').strip(), lang='vi', num_results=10))
                    if len(search_result_list) > 0:
                        return json.dumps(search_result_list)
                    else:
                        return fallback
                # ====================================================

                # summary search result from wikipedia ====================================================
                wikipedia.set_lang('vi')
                wiki_ints = predict_class(msg, model)
                if wiki_ints[0]['intent'] == 'searchwiki':
                    try:
                        rs = wikipedia.summary(msg.replace(':wiki', '').strip())
                        return rs
                    except wikipedia.exceptions.PageError:
                        return fallback
                # ====================================================

                # url shortener ====================================================
                surl_ints = predict_class(msg, model)
                if surl_ints[0]['intent'] == 'shortlink':
                    url_shortener_tool = "https://url-shortener-service.p.rapidapi.com/shorten"
                    headers_url_shortener = {
                        'content-type': "application/x-www-form-urlencoded",
                        'x-rapidapi-host': "url-shortener-service.p.rapidapi.com",
                        'x-rapidapi-key': RAPIDAPI_URLSHORTENER_KEY
                    }

                    url_shortened = requests.post(url_shortener_tool,
                                                  data={'url': msg.replace(':surl', '').strip()},
                                                  headers=headers_url_shortener)
                    return json.loads(url_shortened.text)['result_url']
                # ====================================================

                # calculator ====================================================
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
                    lst_patterns = [c for c in nltk.word_tokenize(msg) if
                                    c in signs or c.isnumeric() or isfloat(c) or c.startswith('-') and c[
                                                                                                       1:].isdigit()]
                    res = client.query(' '.join(lst_patterns))
                    output = next(res.results).text
                    if isfloat(output):
                        return calculator_res.replace('{m}', ' '.join(lst_patterns)).replace('{n}', str(round(
                            float(output), 5)))
                    else:
                        return calculator_res.replace('{m}', ' '.join(lst_patterns)).replace('{n}', output)
                # else:
                #     for c in nltk.word_tokenize(msg):
                #         if c in signs or c.isnumeric() or isfloat(c) or c.startswith('-') and c[1:].isdigit():
                #             res = client.query(msg)
                #             output = next(res.results).text
                #             return output
                # elif c not in signs and c.isnumeric():
                #     ints = predict_class(msg, model)
                #     res = getResponse(ints, show_details=True)
                #     return res
                # ====================================================

                # image to text feature ====================================================
                totext_ints = predict_class(msg, model)
                if totext_ints[0]['intent'] == 'totext':
                    return flask.redirect(flask.url_for('recognize_vietext_img'), code=307)
                if totext_ints[0]['intent'] == 'totext&eng':
                    return flask.redirect(flask.url_for('recognize_engtext_img'), code=307)
                # ====================================================

                # recommendation ====================================================
                film_ints = predict_class(msg, model)
                if film_ints[0]['intent'] == 'recommendphim':
                    if msg.replace(':film', '').strip() in movieGenres:
                        return json.dumps(make_recommendation(msg.replace(':film', '').strip()))
                    else:
                        return 'Xin lỗi, Wiki không tìm thấy phim nào phù hợp với thể loại này'
                # ====================================================

                # currency converter ====================================================
                cc_ints = predict_class(msg, model)
                if cc_ints[0]['intent'] == 'đổitiền':
                    url_currencyconverter_tool = "https://currency-converter5.p.rapidapi.com/currency/convert"

                    fromm = msg.replace(':cc', '').strip().split(',')[0].upper()
                    to = msg.replace(':cc', '').strip().split(',')[1].strip().upper()
                    amount = msg.replace(':cc', '').strip().split(',')[2].strip()

                    querystring = {"format": "json", "from": fromm, "to": to, "amount": amount}
                    headers_currency_converter = {
                        'x-rapidapi-host': "currency-converter5.p.rapidapi.com",
                        'x-rapidapi-key': RAPIDAPI_CURRENCYCONVERTER_KEY
                    }

                    currency_converted = requests.get(url_currencyconverter_tool,
                                                      headers=headers_currency_converter,
                                                      params=querystring)
                    currency_converter_json = json.loads(currency_converted.text)
                    if currency_converter_json['status'] == 'failed':
                        return f"Xin hãy nhập đúng đơn vị tiền tệ '{fromm}'"
                    else:
                        if not currency_converter_json['rates']:
                            return f"Xin hãy nhập đúng đơn vị tiền tệ '{to}'"
                        else:
                            currency_converter_response = 'Đã chuyển {from_amount} {from_code} ({from_name}) sang {to_amount} {to_code} ({to_name}) với tỉ giá cập nhật ngày {updated_date} là {rate} {rate_code}'
                            cc_response = currency_converter_response.replace('{from_amount}', '{0:,.0f}'.format(
                                float(currency_converter_json['amount']))).replace('{from_code}',
                                                                                   currency_converter_json[
                                                                                       'base_currency_code']).replace(
                                '{from_name}',
                                currency_converter_json['base_currency_name']).replace(
                                '{to_amount}',
                                '{0:,.0f}'.format(float(
                                    currency_converter_json['rates'][to]['rate_for_amount']))).replace(
                                '{to_code}',
                                ''.join(list(currency_converter_json['rates'].keys()))).replace('{to_name}',
                                                                                                currency_converter_json[
                                                                                                    'rates'][
                                                                                                    to][
                                                                                                    'currency_name']).replace(
                                '{updated_date}', currency_converter_json['updated_date']).replace('{rate}',
                                                                                                   '{0:,.0f}'.format(
                                                                                                       float(
                                                                                                           currency_converter_json[
                                                                                                               'rates'][
                                                                                                               to][
                                                                                                               'rate']))).replace(
                                '{rate_code}', ''.join(
                                    list(currency_converter_json['rates'].keys())))
                            return cc_response

                # ====================================================

                # ask weather ====================================================
                config_dict = get_default_config()
                config_dict['language'] = 'vi'
                owm = OWM(OPENWEATHERMAP_APIKEY)
                mgr = owm.weather_manager()

                weather_ints = predict_class(msg, model)
                weather_res = getResponse(weather_ints, show_details=True)
                if weather_ints[0]['intent'] == 'thờitiết':
                    observation = mgr.weather_at_place('Đà Nẵng')
                    w = observation.weather
                    weather_info = weather_res.replace('{status}', w.detailed_status).replace('{icon}',
                                                                                              w.weather_icon_url()).replace(
                        '{temp}', str(w.temperature('celsius')['temp'])).replace('{max}', str(
                        w.temperature('celsius')['temp_max'])).replace('{min}', str(
                        w.temperature('celsius')['temp_min'])).replace('{feel}', str(
                        w.temperature('celsius')['feels_like'])).replace('{humidity}', str(w.humidity)).replace(
                        '{pressure}', str(w.pressure["press"])).replace('{visibility}',
                                                                        str(w.visibility_distance / 1000))
                    return weather_info
                # ====================================================

                # facts ====================================================
                FACTS_URL = 'https://kienthuctonghop.vn/nhung-dieu-thu-vi-trong-cuoc-song'
                fact_request = requests.get(FACTS_URL)
                fact_content = fact_request.content
                fact_soup = BeautifulSoup(fact_content, 'lxml')

                # facts
                facts_div = fact_soup.find('div', class_='article')
                facts = facts_div.find_all('li')
                response_facts = [fact.text.replace('\xa0', '').replace('\n', '') for fact in facts][3:-5]

                facts_ints = predict_class(msg, model)
                facts_res = getResponse(facts_ints, show_details=True)
                if facts_ints[0]['intent'] == 'hỏifact':
                    return facts_res.replace('{facts}', random.choice(response_facts))

                # ====================================================

                # ===============================================================================================================

                # answer general question
                return getResponse(ints, show_details=True)
        else:
            return 'Xin lỗi, Wiki không hiểu bạn đang nói gì cả'

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


@app.route('/chat/news', methods=['POST'])
def get_news():
    news_category = request.form['news_cat']

    # news ====================================================
    CATEGORY_URL = 'https://vnexpress.net/rss'
    request_cat = requests.get(CATEGORY_URL)
    content_cat = request_cat.content
    soup_cat = BeautifulSoup(content_cat, 'lxml')

    list_cat = soup_cat.find_all('ul', class_='list-rss')
    cat = [cat.find_all('li') for cat in list_cat]
    cat_title = [title.find('a').text.replace('RSS', '').strip() for titles in cat for title in titles]

    # cat_link = [title.find('a').get('href') for titles in cat for title in titles]
    #
    # news = []

    def categories_link(category):
        if category == 'Trang chủ':
            return '/rss/tin-moi-nhat.rss'
        elif category == 'Thế giới':
            return '/rss/the-gioi.rss'
        elif category == 'Thời sự':
            return '/rss/thoi-su.rss'
        elif category == 'Kinh doanh':
            return '/rss/kinh-doanh.rss'
        elif category == 'Startup':
            return '/rss/startup.rss'
        elif category == 'Giải trí':
            return '/rss/giai-tri.rss'
        elif category == 'Thể thao':
            return '/rss/the-thao.rss'
        elif category == 'Pháp luật':
            return '/rss/phap-luat.rss'
        elif category == 'Giáo dục':
            return '/rss/giao-duc.rss'
        elif category == 'Tin mới nhất':
            return '/rss/tin-moi-nhat.rss'
        elif category == 'Tin nổi bật':
            return '/rss/tin-noi-bat.rss'
        elif category == 'Sức khỏe':
            return '/rss/suc-khoe.rss'
        elif category == 'Đời sống':
            return '/rss/gia-dinh.rss'
        elif category == 'Du lịch':
            return '/rss/du-lich.rss'
        elif category == 'Khoa học':
            return '/rss/khoa-hoc.rss'
        elif category == 'Số hóa':
            return '/rss/so-hoa.rss'
        elif category == 'Xe':
            return '/rss/oto-xe-may.rss'
        elif category == 'Ý kiến':
            return '/rss/y-kien.rss'
        elif category == 'Tâm sự':
            return '/rss/tam-su.rss'
        elif category == 'Cười':
            return '/rss/cuoi.rss'
        elif category == 'Tin xem nhiều':
            return '/rss/tin-xem-nhieu.rss'

    # for cat in cat_title:
    cat_link = categories_link(news_category)
    URL = f'https://vnexpress.net{cat_link}'
    request_news = requests.get(URL)
    content = request_news.content

    # soup xml
    soup_xml = BeautifulSoup(content, 'xml')
    channel_xml = soup_xml.find('channel')
    title = channel_xml.find('title').text.replace(' - VnExpress RSS', '').strip()
    items_xml = channel_xml.find_all('item')
    # soup html
    soup_html = BeautifulSoup(content, 'lxml')
    channel_html = soup_html.find('channel')
    items_html = channel_html.find_all('item')

    # title
    # f'Title: {title}'
    # item_title = [item.find('title').text.replace("\'", '') for item in items_xml]
    # item_description = [item.find('description').text.replace(']]>', '') for item in items_html if
    #                     item.find('description').text]
    item_date = [item.find('pubDate').text for item in items_xml]
    item_link = [item.find('link').text for item in items_xml]

    # title, item_title, item_description, item_date, item_link
    all_news = json.dumps([{'title': title, 'item_date': item_date, 'data': item_link}], ensure_ascii=False)
    # news.append(json.loads(all_news))
    return all_news
    # cat_link
    # news

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
            return 'Xin lỗi, Wiki không hiểu bạn đang nói gì cả'

if __name__ == "__main__":
    app.run(debug=True)