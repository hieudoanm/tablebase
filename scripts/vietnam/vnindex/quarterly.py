"""
Analyse
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


QUARTERS = {
    "2020-q1": ["2020-01", "2020-02", "2020-03"],
    "2020-q2": ["2020-04", "2020-05", "2020-06"],
    "2020-q3": ["2020-07", "2020-08", "2020-09"],
    "2020-q4": ["2020-10", "2020-11", "2020-12"],
    "2021-q1": ["2021-01", "2021-02", "2021-03"],
    "2021-q2": ["2021-04", "2021-05", "2021-06"],
    "2021-q3": ["2021-07", "2021-08", "2021-09"],
    "2021-q4": ["2021-10", "2021-11", "2021-12"],
    "2022-q1": ["2022-01", "2022-02", "2022-03"],
    "2022-q2": ["2022-04", "2022-05", "2022-06"],
    "2022-q3": ["2022-07", "2022-08", "2022-09"],
    "2022-q4": ["2022-10", "2022-11", "2022-12"]
}


def get_month(item) -> str:
    month = "-".join(item.get("date", "").split("-")[0:2])
    return month


def average(numbers) -> float:
    number_of = len(numbers)
    if number_of == 0:
        return 0
    total = 0
    for number in numbers:
        total += number
    return round(total / number_of, 2)


keys = list(dict.keys(QUARTERS))

for key in keys:
    quarterly_rows = []
    for symbol in symbols:
        try:
            history = csv_to_json(f"./data/vietnam/stock/history/{symbol}.csv")
            keys = list(dict.keys(QUARTERS))
            months = QUARTERS[key]
            quarterly_history = list(filter(
                lambda item: get_month(item) in months, history))
            close = list(
                map(lambda item: float(item.get("close", "")), quarterly_history)
            )
            if len(close) == 0:
                quarterly_rows.append(
                    {
                        "symbol": symbol,
                        "percentage": -1,
                        "number_of_dates": len(quarterly_history),
                    }
                )
            else:
                mean = average(close)
                smallest = min(close)
                biggest = max(close)
                percentage = round((mean - smallest) / biggest * 100, 2)
                quarterly_rows.append(
                    {
                        "symbol": symbol,
                        "percentage": percentage,
                        "number_of_dates": len(quarterly_history),
                    }
                )
            sorted_quarterly_rows = sorted(
                quarterly_rows, key=lambda d: d['percentage'])
        except Exception as error:  # pylint: disable=bare-except
            print(symbol, error)
            continue
    write_to_file_csv(
        f"./data/vietnam/stock/quarterly/{key}.csv", sorted_quarterly_rows)
