from googlesearch import search
query = 'thời tiết ngày mai đà nẵng'

search_result_list = list(search(query, lang='vi', num_results=10))
print(search_result_list)