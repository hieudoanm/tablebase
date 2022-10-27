"""
ASX
"""

import csv
import requests

BASE_URL = "https://asx.api.markitdigital.com/asx-research/1.0/companies"
URL = BASE_URL + "/directory?itemsPerPage=3000"

response = requests.get(URL)
responseJSON = response.json()
items = responseJSON["data"]["items"]

companies = []
for item in items:
    symbol = item["symbol"]
    KEY_URL = "{0}/{1}/key-statistics".format(BASE_URL, symbol)
    print(KEY_URL)
    response = requests.get(KEY_URL)
    responseJSON = response.json()
    statistics = responseJSON.get("data", {})
    print(symbol)
    company = {**item, **statistics}
    companies.append(company)

print(len(companies))

allKeys = []
for item in items:
    allKeys += list(item.keys())
keys = list(set(allKeys))
keys.sort()

with open('./data/australia/stock/companies.csv', 'w', newline='', encoding='utf-8') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(items)
