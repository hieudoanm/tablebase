"""
Get Languages
"""

import csv
import requests
import yaml

URL = "https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml"

response = requests.get(URL)
responseYAML = response.text
languages = yaml.safe_load(responseYAML)

languageKeys = list(languages.keys())

listOfLanguages = []

for languageKey in languageKeys:
    value = languages[languageKey]
    value["language"] = languageKey
    listOfLanguages.append(value)
    print(languageKey)

allKeys = []
for item in listOfLanguages:
    allKeys += list(item.keys())
keys = list(set(allKeys))
keys.sort()

print(keys)

with open('./data/github/languages.csv', 'w', newline='', encoding='utf-8') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(listOfLanguages)
