# import wikipedia
# sentence = 'lý thuyết trò chơi'
#
# wikipedia.set_lang('vi')
# rs = wikipedia.summary(sentence)
# print(rs)

# test github copilot
# get the smallest number in the list
list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
def get_smallest_number(list):
    smallest = list[0]
    for i in list:
        if i < smallest:
            smallest = i
    print(smallest)

get_smallest_number(list)

