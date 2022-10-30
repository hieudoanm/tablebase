"""
NASDAQ
"""

import csv
import requests

def write_to_file_csv(file_name, list_of_dict):
    all_keys = []
    for item in list_of_dict:
        all_keys += list(item.keys())
        keys = list(set(all_keys))
    keys.sort()
    with open(file_name, "w", newline="", encoding="utf-8") as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(list_of_dict)

# https://www.nasdaq.com/market-activity/stocks/screener
URL = "https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0"

response = requests.get(URL)
response_json = response.json()
data = response_json.get("data", {})
table = data.get("table", [])
rows = table.get("rows", [])

print(len(rows))

write_to_file_csv("./data/usa/stock/nasdaq.csv", rows)
