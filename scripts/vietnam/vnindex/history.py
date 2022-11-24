"""
History
"""

import csv
from datetime import datetime
import math
import time
import requests

HISTORY_URL = "https://iboard.ssi.com.vn/dchart/api/history"


def csv_to_json(csv_file_path):
    """
    CSV to JSON
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


def write_to_file_csv(file_name, list_of_dict):
    """
    Write to CSV
    """
    all_keys = []
    for item in list_of_dict:
        all_keys += list(item.keys())
        keys = list(set(all_keys))
    with open(file_name, "w+", newline="", encoding="utf-8") as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(list_of_dict)


companies = csv_to_json("./data/vietnam/stock/companies.csv")

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
}


def map_history(stock_symbol, list_t, list_o, list_h, list_l, list_c, list_v):
    """
    Map History
    """
    response_history = []
    for index, value in enumerate(list_t):
        date_time = datetime.fromtimestamp(value)
        date = date_time.strftime("%Y-%m-%d")
        response_history.append({
            "symbol": stock_symbol,
            "date": date,
            "open": float(list_o[index]),
            "high": float(list_h[index]),
            "low": float(list_l[index]),
            "close": float(list_c[index]),
            "volume": float(list_v[index]),
            "timestamp": float(list_t[index])
        })
    return response_history


for company in companies:
    try:
        symbol = company["symbol"]
        history_file_path = f"./data/vietnam/stock/history/{symbol}.csv"
        old_history = csv_to_json(history_file_path)
        # Get Company History
        to = math.floor(time.time())
        history_url = HISTORY_URL + \
            f"?resolution=D&symbol={symbol}&from=0&to={to}"
        print(history_url)
        history_response = requests.get(
            history_url, allow_redirects=False, headers=headers, timeout=10)
        history_json = history_response.json()
        t = history_json.get("t", [])
        o = history_json.get("o", [])
        h = history_json.get("h", [])
        l = history_json.get("l", [])
        c = history_json.get("c", [])
        v = history_json.get("v", [])
        new_history = map_history(symbol, t, o, h, l, c, v)
        combine_history = new_history + old_history
        history = list({v['date']: v for v in combine_history}.values())
        history = sorted(
            history, key=lambda h: h['date'])
        if len(history) == 0:
            continue
        write_to_file_csv(history_file_path, history)
    except:  # pylint: disable=bare-except
        print("Error")
