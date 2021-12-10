import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from ast import literal_eval
import numpy as np
from multiprocessing import Process

# url from google drive
movieData_url = 'https://drive.google.com/file/d/1COQ8cuUUCP9jPpbRwqEjZbyqFzO6sx1b/view?usp=sharing'
credits_url = 'https://drive.google.com/file/d/127Q7AYuisHeACdcDE_C1MXDOf6Ue77vX/view?usp=sharing'
keywords_url = 'https://drive.google.com/file/d/1TLLQczoE8Rxl6YNoGNGKH5vZEyOjS9eF/view?usp=sharing'
# download url
movieData_download_url = 'https://drive.google.com/uc?id=' + movieData_url.split('/')[-2]
credits_download_url = 'https://drive.google.com/uc?id=' + credits_url.split('/')[-2]
keywords_download_url = 'https://drive.google.com/uc?id=' + keywords_url.split('/')[-2]

movieData = pd.read_csv(movieData_download_url, low_memory=False)
credits = pd.read_csv(credits_download_url)
keywords = pd.read_csv(keywords_download_url)

# get only first 10000 movies
movieData = movieData.iloc[0:10000, :]
credits = credits.iloc[0:10000, :]
keywords = keywords.iloc[0:10000, :]

# # replace NaN with an empty string
# credits['id'] = credits['id'].fillna('')

# convert IDs to int. Required for merging on id using pandas .merge() command
keywords['id'] = keywords['id'].astype('int')
credits['id'] = credits['id'].astype('int')
movieData['id'] = movieData['id'].astype('int')

# get all genres
movieGenres = []
for i in range(len(movieData)):
  for genre in literal_eval(movieData['genres'][i]):
    movieGenres.append(genre['name'].lower())


# Merge keywords and credits into your main movieData dataframe: this will look for candidates
# on the credits and keywords tables and have ids that match those in the movieData table, which we will use as
# our main data from now on.
movieData = movieData.merge(credits, on='id')
movieData = movieData.merge(keywords, on='id')

# parse the stringified features into their corresponding python objects
features = ['cast', 'crew', 'keywords', 'genres']
for feature in features:
    movieData[feature] = movieData[feature].apply(literal_eval)

# '''the crew list for a particular movie has one dictionary object per crew member.
# Each dictionary has a key called 'job' which tells us if that person was the director or not.
# With that in mind we can create a function to extract the director:'''
def get_director(x):
    for i in x:
        if i['job'] == 'Director':
            return i['name']
    return np.nan

# getting a list of the actors, keywords and genres
def get_list(x):
    if isinstance(x, list): # checking to see if the input is a list or not
        names = [i['name'] for i in x] # if we take a look at the data, we find that the word 'name' is used as a key
                                       # for the names actors, the actual keywords and the actual genres

        # check if more than 3 elements exist. If yes, return only first three.
        # if no, return entire list. Too many elements would slow down our algorithm too much
        # and 3 should be more than enough for good recommendations.
        if len(names) > 3:
            names = names[:3]
        return names

    # return emtpy list in case of missing/malformed data
    return []

# '''
# Now that we have written functions to clean up our data into director
# names and listswith only the relevant info for cast, keywords and genres,
# we can apply those functions to our data and see the results:
# '''
movieData['director'] = movieData['crew'].apply(get_director)

features = ['cast', 'keywords', 'genres']
for feature in features:
    movieData[feature] = movieData[feature].apply(get_list)

# print(movieData[['title', 'cast', 'director', 'keywords', 'genres']].head())

# Creating a Word Soup
def clean_data(x):
    if isinstance(x, list):
        return [str.lower(i.strip()) for i in x] # cleaning up spaces in the data
    else:
        # check if director exists. If not, return empty string
        if isinstance(x, str):
            return str.lower(x.strip())
        else:
            return ''

# apply clean_data function to your features
features = ['cast', 'keywords', 'director', 'genres']
for feature in features:
    movieData[feature] = movieData[feature].apply(clean_data)

# this functon makes use of the property of the cosine similarity function that the order
# and types of inputs don't mattter, what matters is the similarity between different soups of words
def create_soup(x):
    return ' '.join(x['keywords']) + ' ' + ' '.join(x['cast']) + ' ' + x['director'] + ' ' + ' '.join(x['genres'])

movieData['soup'] = movieData.apply(create_soup, axis=1)

# getting the user's input for genre, actors and directors of their liking
def ask_genres():
    return 'Bạn thích thể loại phim nào? Nếu không thì bạn có thể nhắn "Bỏ qua" để bỏ qua câu hỏi này'

def ask_actors():
    return 'Bạn có thể cho biết tên các diễn viên của bộ phim được không? Nếu không thì bạn có thể nhắn "Bỏ qua" để bỏ qua câu hỏi này'

def ask_directors():
    return 'Bạn có thể cho biết tên đạo diễn của bộ phim được không? Nếu không thì bạn có thể nhắn "Bỏ qua" để bỏ qua câu hỏi này'

def ask_keywords():
    return 'Bạn có từ khóa nào mô tả về bộ phim bạn muốn xem không? Nếu không thì bạn có thể nhắn "Bỏ qua" để bỏ qua câu hỏi này'

def get_genres(genres):
    # genres = input('Bạn thích thể loại phim nào? Nếu không thì bạn có thể nhắn "Bỏ qua" để bỏ qua câu hỏi này')
    genres = ' '.join([''.join(n.split()) for n in genres.lower().split(',')])
    return genres

def get_actors(actors):
    # actors = input('Bạn có thể cho biết tên các diễn viên của bộ phim được không? Nếu không thì bạn có thể nhắn "Bỏ qua" để bỏ qua câu hỏi này')
    actors = ' '.join([''.join(n.split()) for n in actors.lower().split(',')])
    return actors

def get_directors(directors):
    # directors = input('Bạn có thể cho biết tên đạo diễn của bộ phim được không? Nếu không thì bạn có thể nhắn "Bỏ qua" để bỏ qua câu hỏi này')
    directors = ' '.join([''.join(n.split()) for n in directors.lower().split(',')])
    return directors

def get_keywords(keywords):
    # keywords = input('Bạn có từ khóa nào mô tả về bộ phim bạn muốn xem không? Nếu không thì bạn có thể nhắn "Bỏ qua" để bỏ qua câu hỏi này')
    keywords = ' '.join([''.join(n.split()) for n in keywords.lower().split(',')])
    return keywords

def get_searchTerms(msg):
    searchTerms = []

    ask_genre = ask_genres()
    genres = get_genres(msg)
    if genres != 'Bỏ qua':
        ask_genre
        searchTerms.append(genres)

    actors = get_actors(msg)
    if actors != 'Bỏ qua':
        searchTerms.append(actors)

    directors = get_directors(msg)
    if directors != 'Bỏ qua':
        searchTerms.append(directors)

    keywords = get_keywords(msg)
    if keywords != 'Bỏ qua':
        searchTerms.append(keywords)

    return searchTerms

# make recommendation
def make_recommendation(msg, movieData=movieData):
    new_row = movieData.iloc[-1, :].copy() # creating a copy of the last row of the dataset
                                           # which we will use to input the user's input

    # grabbing the new wordsoup from the user
    searchTerms = get_searchTerms(msg)
    new_row.iloc[-1] = ' '.join(searchTerms) # adding the input to our new row

    # adding the new row to the dataset
    movieData = movieData.append(new_row)

    # vectorizing the entire matrix as described above
    count = CountVectorizer(stop_words='english')
    count_matrix = count.fit_transform(movieData['soup'])

    # running pairwise cosine similarity
    cosine_sim2 = cosine_similarity(count_matrix, count_matrix) # getting a similarity matrix

    # sorting cosine similarities by highest to lowest
    sim_scores = list(enumerate(cosine_sim2[-1, :]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # matching the similarities to the movie titles and ids
    ranked_titles = []
    for i in range(1, 11):
        indx = sim_scores[i][0]
        ranked_titles.append([movieData['title'].iloc[indx], movieData['imdb_id'].iloc[indx], movieData['runtime'].iloc[indx], movieData['release_date'].iloc[indx], movieData['vote_average'].iloc[indx]])

    # ranked_titles = np.array(ranked_titles)
    print(type(ranked_titles))
    return ranked_titles







