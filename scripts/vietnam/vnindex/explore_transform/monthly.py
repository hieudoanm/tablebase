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
        all_keys = list(set(all_keys))
    all_keys.sort()
    with open(file_name, "w+", newline="", encoding="utf-8") as output_file:
        dict_writer = csv.DictWriter(output_file, all_keys)
        dict_writer.writeheader()
        dict_writer.writerows(list_of_dict)


companies = csv_to_json("./data/vietnam/stock/companies.csv")
symbols = list(map(lambda company: company.get("symbol", ""), companies))


def get_month(item) -> str:
    """
    Get Month
    """
    month_from_date = "-".join(item.get("date", "").split("-")[0:2])
    return month_from_date


def average(numbers) -> float:
    """
    Average
    """
    number_of = len(numbers)
    if number_of == 0:
        return 0
    total = 0
    for number in numbers:
        total += number
    return round(total / number_of, 2)


def add_zero(number) -> str:
    """
    Add Zero
    """
    if number > 9:
        return str(number)
    return f"0{number}"


MONTHS = range(1, 12+1)
YEARS = range(2000, 2022+1)


for MONTH in MONTHS:
    for YEAR in YEARS:
        FILE_NAME = f"{YEAR}-{add_zero(MONTH)}"
        monthly_rows = []
        for symbol in symbols:
            try:
                history = csv_to_json(
                    f"./data/vietnam/stock/history/{symbol}.csv")
                monthly_history = list(filter(
                    lambda item: get_month(item) == FILE_NAME, history))
                close = list(
                    map(lambda item: float(item.get("close", "")), monthly_history)
                )
                if len(close) == 0:
                    monthly_rows.append(
                        {
                            "symbol": symbol,
                            "percentage": -1,
                            "number_of_dates": len(monthly_history),
                        }
                    )
                else:
                    mean = average(close)
                    smallest = min(close)
                    biggest = max(close)
                    percentage = round((mean - smallest) / biggest * 100, 2)
                    monthly_rows.append(
                        {
                            "symbol": symbol,
                            "percentage": percentage,
                            "number_of_dates": len(monthly_history),
                        }
                    )
                sorted_monthly_rows = sorted(
                    monthly_rows, key=lambda d: d['percentage'])
            except Exception as error:  # pylint: disable=bare-except
                print(symbol, error)
                continue
        write_to_file_csv(
            f"./data/vietnam/stock/monthly/{FILE_NAME}.csv", sorted_monthly_rows)
