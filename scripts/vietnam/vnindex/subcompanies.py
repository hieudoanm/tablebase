"""
Subcompanies
"""

import csv
import requests

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

INFO_URL = 'https://finfo-iboard.ssi.com.vn/graphql'

SUBCOMPANIES_QUERY = """
query subCompanies {
    subCompanies(symbol: "%s", size: 2000, offset: 0) {
        datas {
            childsymbol
        }
    }
}
"""

headers = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
}

def filter_companies(symbols):
    """
    Filter Companies
    """
    return list(filter(lambda company: company["symbol"] in symbols, companies))

for company in companies:
    symbol = company.get("symbol", "")
    try:
        subcompanies_query = SUBCOMPANIES_QUERY % (symbol)
        subcompanies_response = requests.post(url=INFO_URL, json={"query": subcompanies_query}, headers=headers, timeout=10)
        print(symbol, subcompanies_response)
        subcompanies_json = subcompanies_response.json()
        subcompanies_data = subcompanies_json.get("data")
        subcompanies_list = subcompanies_data.get("subCompanies")
        if subcompanies_list is None:
            continue
        subcompanies_datas = subcompanies_list.get("datas")
        subcompanies = list(map(
            lambda subcompanies_data: subcompanies_data.get("childsymbol"), subcompanies_datas
        ))
        subcompanies = list(filter(lambda subcompany: subcompany != '', subcompanies))
        if len(subcompanies) == 0:
            continue
        print(subcompanies)
        filtered_companies = filter_companies(subcompanies)
        subcompanies_file_path = "./data/vietnam/stock/subcompanies/{0}.csv".format(symbol)
        write_to_file_csv(subcompanies_file_path, filtered_companies)
    except: # pylint: disable=bare-except
        print(symbol, "Error")