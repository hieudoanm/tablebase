"""
NASDAQ
"""

import csv
import requests


def write_to_file_csv(file_name, list_of_dict):
    """
    Write to File
    """
    all_keys = []
    for item in list_of_dict:
        all_keys += list(item.keys())
        keys = list(set(all_keys))
    keys.sort()
    with open(file_name, "w+", newline="", encoding="utf-8") as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(list_of_dict)


URL = "https://www.nyse.com/api/quotes/filter"

response = requests.post(URL, timeout=30, data={
    "instrumentType": "EQUITY",
    "pageNumber": 1,
    "sortColumn": "NORMALIZED_TICKER",
    "sortOrder": "ASC",
    "maxResultsPerPage": 1000000000,
    "filterToken": ""
}, cookies="BIGipServernyse.com=1174809866.16395.0000; TS0146f69d=013ade2eab1cacc4c3b9be39b0c088929a9da92ae94ca903df6c4d806f4cd631951a1264177696042840c8d7d041f73d52c5edbe256e514cf37e8aa1251b412058fc41238e")
print(response)
response_json = response.json()

print(len(response_json))

write_to_file_csv("./data/usa/stock/nyse.csv", response_json)
