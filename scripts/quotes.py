"""
Get Quotes
"""

import csv
import requests

BASE_URL = "https://api.quotable.io/quotes?page={0}&limit=150"

response = requests.get(BASE_URL.format(1))
responseJSON = response.json()
totalPages = responseJSON.get('totalPages')
totalCount = responseJSON.get('totalCount')
print(totalPages, totalCount)

quotes = []

for i in range(totalPages + 1):
    quotesResponse = requests.get(BASE_URL.format(i))
    quotesJSON = quotesResponse.json()
    quotesResults = quotesJSON.get('results')
    quotes += quotesResults
    print(i)

print(len(quotes))

allKeys = []
for item in quotes:
    allKeys += list(item.keys())
keys = list(set(allKeys))
keys.sort()

with open('./data/quotes/quotes.csv', 'w', newline='', encoding='utf-8') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(quotes)
