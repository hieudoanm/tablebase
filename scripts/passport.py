"""
Passport Index
"""

import csv
import requests
from bs4 import BeautifulSoup

countries = [
    'australia',
    'finland',
    'germany',
    'netherlands',
    'new-zealand',
    'singapore',
    'south-korea',
    'united-kingdom',
    'united-states-of-america',
    'viet-nam',
]

for country in countries:
    URL = "https://www.passportindex.org/passport/" + country
    response = requests.get(URL)
    html = response.text
    soup = BeautifulSoup(html, "html.parser")
    rows = soup.find_all("table")[0].find("tbody").find_all("tr")
    rowsList = list(rows)
    print(country)
    visas = []
    for row in rows:
        cells = row.find_all("td")
        cellsList = list(cells)
        countryText = cellsList[0].getText().strip()
        requirementText = cellsList[1].getText().strip()
        visa = {}
        visa["country"] = countryText
        visa["requirement"] = requirementText
        visas.append(visa)
    allKeys = []
    for item in visas:
        allKeys += list(item.keys())
    keys = list(set(allKeys))
    keys.sort()
    with open('./data/world/visas/{0}.csv'.format(country), 'w', newline='', encoding='utf-8') as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(visas)
