import json
import nltk

data = {
    "intents": [{
            "tag": "chào",
            "patterns": ["xin chào", "chào", "yooo", "hey", "alo", "hi", "hello", "holla", "ê"],
            "responses": ["Xin chào, tôi có thể giúp gì cho bạn không?", "Chào nhá", "Xin chào bạn", "Yoo bro"],
            "context": [""]
        },
        {
            "tag": "tạmbiệt",
            "patterns": ["byee", "bye", "gặp lại sau nhá", "later", "chào nhá"],
            "responses": ["Tạm biệt nhé", "Bye bye", "Sau gặp lại", "Ok, chúc bạn một ngày tốt lành!", "Gặp lại sau nhé", "Bí bi", "Bai", "Bái bai", "Bái bai nhá"],
            "context": [""]
        },
        {
            "tag": "cảmơn",
            "patterns": ["Cảm ơn bạn nhé", "Cảm ơn bạn", "Mình cảm ơn nhé", "Ồ cảm ơn bạn nha", "Cảm ơn", "Thanks", "Tks", "Thank you", "Mơn", "Củm ơn", "Cảm ơn nhá", "Mơn nhá", "wow cảm ơn bạn nhé", "Thật hữu ích"],
            "responses": ["Rất vui đã giúp bạn", "Đó là vinh dự của tôi", "Không có gì đâu bạn", "Haha không có gì đâu"],
            "context": [""]
     	}
    ]
}

intents = json.loads(open('./intents.json', encoding='utf-8').read())

sentence = 'Tính thử 1 + 2 bằng mấy'
signs = ['+', '-', '*', 'x', '/', '÷', '(', ')', '!', '=', '^', 'C', 'F']
lst_patterns = []
patterns = ''
for w in nltk.word_tokenize(sentence):
    # for i in intents['intents'][-1]['patterns']:
    if w in signs or w.isnumeric():
        lst_patterns.append(w)
        patterns = ' '.join(lst_patterns)
print(patterns)

        # other_str = i.find()
        # replaced_p = i.replace(, '')
        # print(replaced_p)
        # if w in i:
        #     p = i.replace(w, '')
        #     print(p)
        # print(i.replace('{n}', 'Kha'))
        # print(nltk.word_tokenize(i))
        # if i in i:
        #     p =

