"""
Get Countries
"""

import csv
import requests

COUNTRIES_URL = "https://restcountries.com/v3/all"

response = requests.get(COUNTRIES_URL)
print(response)
countries = response.json()
print(len(countries))


allKeys = []
for item in countries:
    allKeys += list(item.keys())
keys = list(set(allKeys))
keys.sort()

with open('./data/world/countries.csv', 'w', newline='', encoding='utf-8') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(countries )
