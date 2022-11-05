"""
CSV to JSON
"""

import csv
import json
import os

def csv_to_json(csv_file_path, json_file_path):
    """
    CSV to JSOn
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
    # convert python jsonArray to JSON String and write to file
    with open(json_file_path, "w+", encoding="utf-8") as json_file:
        json_string = json.dumps(json_array, indent=4)
        json_file.write(json_string)

for root_dir, cur_dir, files in os.walk("./data"):
    csv_files = list(filter(lambda file: ".csv" in file, files))
    if len(csv_files) == 0:
        continue
    for file in files:
        print("file", file)
        csv_file_path = root_dir + "/" + file
        json_file_path = csv_file_path.replace("./data", "./json").replace(".csv", ".json")
        csv_to_json(csv_file_path, json_file_path)
