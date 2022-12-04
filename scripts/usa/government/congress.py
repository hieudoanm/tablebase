"""
USA Congress
"""

import csv
import os
from dotenv import load_dotenv
import requests

load_dotenv()

FIRST_CONGRESS = 80
CURRENT_CONGRESS = 117
CONGRESSES = list(range(FIRST_CONGRESS, CURRENT_CONGRESS + 1))
CONGRESSES.reverse()
CHAMBERS = ["house", "senate"]

BASE_URL = "https://api.propublica.org/congress/v1"
COMMITTEES_URL = "{0}/{1}/{2}/committees.json"
COMMITTEE_URL = "{0}/{1}/{2}/committees/{3}.json"
SUBCOMMITTEE_URL = "{0}/{1}/{2}/committees/{3}/subcommittees/{4}.json"
MEMBERS_URL = "{0}/{1}/{2}/members.json"
MEMBER_URL = "{0}/members/{1}.json"

PARTIES = {
    "D": "Democratic",
    "ID": "Independent Democratic",
    "R": "Republican"
}

STATES = {
    "AK": "Alaska",
    "AL": "Alabama",
    "AR": "Arkansas",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DC": "District of Columbia",
    "DE": "Delaware",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "IA": "Iowa",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "MA": "Massachusetts",
    "MD": "Maryland",
    "ME": "Maine",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MO": "Missouri",
    "MP": "Northern Mariana Islands",
    "MS": "Mississippi",
    "MT": "Montana",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "NE": "Nebraska",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NV": "Nevada",
    "NY": "New York",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VA": "Virginia",
    "VI": "U.S. Virgin Islands",
    "VT": "Vermont",
    "WA": "Washington",
    "WI": "Wisconsin",
    "WV": "West Virginia",
    "WY": "Wyoming",
}

API_KEY_PROPUBLICA_CONGRESS = os.getenv("API_KEY_PROPUBLICA_CONGRESS")
headers = {}
headers["X-API-Key"] = API_KEY_PROPUBLICA_CONGRESS

BASE_FILE_PATH = "./data/usa/congress"


def write_to_file_csv(csv_file_name, list_of_dict):
    """
    Write to CSV
    """
    all_keys = []
    for item in list_of_dict:
        all_keys += list(item.keys())
        keys = list(set(all_keys))
    keys.sort()
    with open(csv_file_name, "w+", newline="", encoding="utf-8") as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(list_of_dict)


def get_members(congress, chamber):
    """
    Get Members
    """
    members_url = MEMBERS_URL.format(BASE_URL, congress, chamber)
    response = requests.get(members_url, headers=headers, timeout=30)
    response_json = response.json()
    return response_json.get("results", [])


def get_committees(congress, chamber):
    """
    Get Committees
    """
    committees_url = COMMITTEES_URL.format(BASE_URL, congress, chamber)
    response = requests.get(committees_url, headers=headers, timeout=30)
    response_json = response.json()
    return response_json.get("results", [])


for CHAMBER in CHAMBERS:
    for CONGRESS in CONGRESSES:
        print(CHAMBER, CONGRESS)
        # Members
        members_results = get_members(CONGRESS, CHAMBER)
        for members_result in members_results:
            members = members_result.get("members", [])
            if len(members) == 0:
                continue
            file_name = f"{BASE_FILE_PATH}/{CHAMBER}/{CONGRESS}/members.csv"
            write_to_file_csv(file_name, members)
        # Committees
        committees_results = get_committees(CONGRESS, CHAMBER)
        for committees_result in committees_results:
            committees = committees_result.get("committees", [])
            if len(committees) == 0:
                continue
            file_name = f"{BASE_FILE_PATH}/{CHAMBER}/{CONGRESS}/committees.csv"
            write_to_file_csv(file_name, committees)
