"""
1000 Common Words
"""

import csv
import requests
from bs4 import BeautifulSoup

TIMEOUT = 30
LANGUAGES_URL = "https://1000mostcommonwords.com/languages/"
languages_response = requests.get(LANGUAGES_URL, timeout=TIMEOUT)
languages_html = languages_response.text
languages_soup = BeautifulSoup(languages_html, "html.parser")
list_items = languages_soup.find_all("li")

for list_item in list_items:
    anchor = list_item.find("a", href=True)
    language = anchor.text.lower()
    file_name = "-".join(language.split(" "))
    column = "_".join(language.split(" "))
    link = anchor["href"]
    try:
        if '1000-most-common' in link:
            print(language, link)
            response = requests.get(link, timeout=TIMEOUT)
            html = response.text
            soup = BeautifulSoup(html, "html.parser")
            tables = soup.find_all("table")
            words = []
            # Process Tablee
            for index, table in enumerate(tables):
                rows = table.find("tbody").find_all("tr")
                for row in rows:
                    cells = row.find_all("td")
                    cellsList = list(cells)
                    numberText = cellsList[0].getText().strip().lower()
                    languageText = cellsList[1].getText().strip().lower()
                    englishText = cellsList[2].getText().strip().lower()
                    if "number" != numberText:
                        word = {}
                        word["number"] = int(numberText) + index * 100
                        word[column] = languageText
                        word["english"] = englishText
                        words.append(word)
            words = sorted(words, key=lambda h: h['english'])
            # Save to CSV
            keys = ["number", column, "english"]
            with open('./data/words/1000-most-common/{0}.csv'.format(file_name), 'w', newline='', encoding='utf-8') as output_file:
                dict_writer = csv.DictWriter(output_file, keys)
                dict_writer.writeheader()
                dict_writer.writerows(words)
    except:
        print(language, "Error")
