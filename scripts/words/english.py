"""
1000 Most Common English Words
"""


import nltk
import csv
from nltk import pos_tag
from nltk.corpus import stopwords
from nltk.corpus import wordnet as wn

# Just to make it a bit more readable
WN_NOUN = 'n'
WN_VERB = 'v'
WN_ADJECTIVE = 'a'
WN_ADJECTIVE_SATELLITE = 's'
WN_ADVERB = 'r'


def convert(word, from_pos, to_pos):
    """ Transform words given from/to POS tags """

    synsets = wn.synsets(word, pos=from_pos)

    # Word not found
    if not synsets:
        return []

    for synset in synsets:
        for lemma in synset.lemmas():
            print(synset.name(), lemma.name())

    # Get all lemmas of the word (consider 'a'and 's' equivalent)
    lemmas = [lemma for synset in synsets
              for lemma in synset.lemmas()
              if synset.name().split('.')[1] == from_pos
              or from_pos in (WN_ADJECTIVE, WN_ADJECTIVE_SATELLITE)
              and synset.name().split('.')[1] in (WN_ADJECTIVE, WN_ADJECTIVE_SATELLITE)]

    # Get related forms
    derivationally_related_forms = [
        (l, l.derivationally_related_forms()) for l in lemmas]

    # filter only the desired pos (consider 'a' and 's' equivalent)
    related_noun_lemmas = [l for drf in derivationally_related_forms
                           for l in drf[1]
                           if l.synset.name().split('.')[1] == to_pos
                           or to_pos in (WN_ADJECTIVE, WN_ADJECTIVE_SATELLITE)
                           and l.synset.name().split('.')[1] in (WN_ADJECTIVE, WN_ADJECTIVE_SATELLITE)]

    # Extract the words from the lemmas
    words = [l.name() for l in related_noun_lemmas]
    len_words = len(words)

    # Build the result in the form of a list containing tuples (word, probability)
    result = [(w, float(words.count(w))/len_words) for w in set(words)]
    result.sort(key=lambda w: -w[1])

    # return all the possibilities sorted by probability
    return result


def csv_to_json(csv_file_path):
    """
    CSV to JSOn
    """
    json_array = []
    # read csv file
    with open(csv_file_path, encoding="utf-8") as csvf:
        # load csv file data using csv library"s dictionary reader
        csv_reader = csv.DictReader(csvf)

        # convert each csv row into python dict
        for row in csv_reader:
            # add this python dict to json array
            json_array.append(row)
    return json_array


nltk.download("stopwords")

stop_words = set(stopwords.words("english"))


words = csv_to_json("./data/words/1000-most-common/german.csv")
english_words = list(map(lambda word: word['english'], words))
english_words.sort()
english_words_without_stopwords = [
    w for w in english_words if w not in stop_words]
print(english_words_without_stopwords)
print(len(english_words_without_stopwords))

tagged_words = pos_tag(english_words_without_stopwords)

for tagged_word in tagged_words:
    word = tagged_word[0]
    word_type = tagged_word[1]
    word_noun = ""
    print(word, word_type, word_noun)
    # if word_type != "NN":
    #     if word_type == "JJ":
    #         result = convert(word, 'a', 'n')
    #         print(result)
