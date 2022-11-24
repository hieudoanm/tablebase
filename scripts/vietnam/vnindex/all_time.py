"""
All Time
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
        keys = list(set(all_keys))
    all_keys.sort()
    with open(file_name, "w+", newline="", encoding="utf-8") as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(list_of_dict)


companies = csv_to_json("./data/vietnam/stock/companies.csv")
symbols = list(map(lambda company: company.get("symbol", ""), companies))


all_time = []


for symbol in symbols:
    try:
        history = csv_to_json(f"./data/vietnam/stock/history/{symbol}.csv")
        most_recent = history[len(history) - 1]
        date = most_recent.get("date")
        close = float(most_recent.get("close"))
        low = list(map(lambda item: float(item.get("low", "")), history))
        lowest = min(low)
        high = list(map(lambda item: float(item.get("high", "")), history))
        highest = max(high)
        percentage = round((close - lowest) / highest * 100, 2)
        print(symbol, date, close, percentage, lowest, highest, percentage)
        all_time.append(
            {
                "symbol": symbol,
                "date": date,
                "close": close,
                "percentage": percentage,
                "lowest": lowest,
                "highest": highest,
            }
        )
    except:  # pylint: disable=bare-except
        print(symbol, "Error")
        continue


sorted_all_time = sorted(
    all_time, key=lambda d: d['percentage'])
write_to_file_csv("./data/vietnam/stock/all-time.csv", sorted_all_time)
