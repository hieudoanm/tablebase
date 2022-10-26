"""
Get Timezones
"""

import csv
import requests

timeZonesResponse = requests.get("https://worldtimeapi.org/api/timezone")
timeZones = timeZonesResponse.json()

listOfTimeZones = []

for timeZone in timeZones:
    url = "http://worldtimeapi.org/api/timezone/" + timeZone
    print(timeZone)
    try:
        timeZoneResponse = requests.get(url)
        timeZone = timeZoneResponse.json()
        listOfTimeZones.append(timeZone)
    except: # pylint: disable=bare-except
        print("TimeZone Error")

keys = listOfTimeZones[0].keys()

with open('./data/world/timezones.csv', 'w', newline='', encoding='utf-8') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(listOfTimeZones)
