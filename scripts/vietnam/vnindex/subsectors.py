"""
Subsectors
"""

import csv


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
        all_keys = list(set(all_keys))
    all_keys.sort()
    with open(file_name, "w+", newline="", encoding="utf-8") as output_file:
        dict_writer = csv.DictWriter(output_file, all_keys)
        dict_writer.writeheader()
        dict_writer.writerows(list_of_dict)


companies = csv_to_json("./data/vietnam/stock/companies.csv")
subsectors = list(
    set(list(map(lambda company: company.get("subsector"), companies))))
subsectors = list(filter(lambda subsector: subsector != "", subsectors))
subsectors.sort()

FILE_PATH = "./data/vietnam/stock/subsectors/"


def filter_companies(stock_subsector):
    """
    Filter Companies
    """
    return list(filter(lambda company: company["subsector"] == stock_subsector, companies))


for subsector in subsectors:
    print("subsector", subsector)
    filtered_companies = filter_companies(subsector)
    SUBSECTOR_FILE_PATH = FILE_PATH + \
        "-".join(subsector.lower().split(" ")) + ".csv"
    print(SUBSECTOR_FILE_PATH)
    write_to_file_csv(SUBSECTOR_FILE_PATH, filtered_companies)
