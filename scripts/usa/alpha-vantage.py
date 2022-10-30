"""
Alpha Vantage
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY_ALPHA_VANTAGE = os.getenv('API_KEY_ALPHA_VANTAGE')

symbols = ["AAPL"]

for symbol in symbols:
    URL = "https://www.alphavantage.co/query?function={0}&symbol={1}&outputsize={2}&datatype={3}&apikey={4}".format("TIME_SERIES_DAILY", symbol, "full", "csv", API_KEY_ALPHA_VANTAGE)
    response = requests.get(URL)
    history_csv = response.text
    file_path = "./data/usa/stock/history/{0}.csv".format(symbol)
    history_file = open(file_path, "w", encoding='utf-8')
    history_file.write(history_csv)
    history_file.close()
