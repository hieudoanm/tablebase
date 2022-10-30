"""
Stock Watch
"""

import requests

HOUSE_URL = "https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.csv"
SENATE_URL = "https://senate-stock-watcher-data.s3-us-west-2.amazonaws.com/aggregate/all_transactions.csv"

URLS = {
    "house": HOUSE_URL,
    "senate": SENATE_URL
}

for chamber in URLS:
    URL = URLS[chamber]
    response = requests.get(URL)
    stock_watch_csv = response.text
    file_name = "./data/usa/stock-watch/{0}/all_transactions.csv".format(chamber)
    stock_watch_file = open(file_name, "w", encoding='utf-8')
    stock_watch_file.write(stock_watch_csv)
    stock_watch_file.close()
