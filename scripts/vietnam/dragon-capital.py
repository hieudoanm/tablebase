"""
Dragon Capital
"""

import csv
import requests

def write_to_csv(file_path, list_of_dict):
    all_keys = []
    for item in list_of_dict:
        all_keys += list(item.keys())
    keys = list(set(all_keys))
    keys.sort()
    with open(file_path, 'w', newline='', encoding='utf-8') as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(list_of_dict)


product_codes = ["e1vfvn30", "fuevfvnd", "dcbc", "dcds"]

BASE_URL = "https://api.dragoncapital.com.vn/fundfactsheet/top_holdings/getValueByDate.php"

for product_code in product_codes:
    dates_url = "{0}?trade_code={1}".format(BASE_URL, product_code);
    dates_response = requests.get(dates_url)
    response_json = dates_response.json()
    available_dates = response_json["available_dates"]
    available_dates_file_path = "./data/vietnam/stock/capital/dragon-capital/{0}/available-dates.csv".format(product_code)
    available_dates_rows = []
    for available_date in available_dates:
        available_dates_row = {}
        available_dates_row["available_date"] = available_date
        available_dates_row["product_code"] = product_code
        available_dates_row["capital"] = "dragon-capital"
        available_dates_rows.append(available_dates_row)
    write_to_csv(available_dates_file_path, available_dates_rows)
    top_holdings_rows = []
    for available_date in available_dates:
        print(product_code, available_date)
        top_holdings_url = "{0}?trade_code={1}&date_upload={2}".format(BASE_URL, product_code, available_date)
        top_holdings_response = requests.get(top_holdings_url)
        top_holdings_json = top_holdings_response.json()
        top_holdings = top_holdings_json["ffs_holding"]
        top_holdings_rows += top_holdings
    top_holdings_file_path = "./data/vietnam/stock/capital/dragon-capital/{0}/portfolio.csv".format(product_code)
    write_to_csv(top_holdings_file_path, top_holdings_rows)