"""
VNINDEX
"""

import csv

from .companies import get_companies


def write_to_file_csv(file_name, list_of_dict):
    """
    Write to CSV
    """
    all_keys = []
    for item in list_of_dict:
        all_keys += list(item.keys())
        all_keys = list(set(all_keys))
    all_keys.sort()
    with open(file_name, "w+", newline="", encoding="utf-8") as output_file:
        dict_writer = csv.DictWriter(output_file, all_keys)
        dict_writer.writeheader()
        dict_writer.writerows(list_of_dict)


companies = get_companies()


sorted_all_time = sorted(
    companies, key=lambda d: d['symbol'])


write_to_file_csv("./data/vietnam/stock/companies.csv", companies)
