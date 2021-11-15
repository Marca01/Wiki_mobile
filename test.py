import wikipedia
sentence = 'lý thuyết trò chơi'

wikipedia.set_lang('vi')
rs = wikipedia.summary(sentence)
print(rs)