"""
Companies
"""

import csv
import requests


GATEWAY_URL = "https://wgateway-iboard.ssi.com.vn/graphql"
INFO_URL = "https://finfo-iboard.ssi.com.vn/graphql"
TIMEOUT = 60


STOCK_SYMBOL_QUERY = """
query {
    hose: stockRealtimes(exchange: "hose") {
      stockSymbol
    }
    hnx: stockRealtimes(exchange: "hnx") {
      stockSymbol
    }
    upcom: stockRealtimes(exchange: "upcom") {
      stockSymbol
    }
}
"""


COMPANY_PROFILE_QUERY = """
query companyProfile {
    companyProfile(symbol: "%s", language: "en") {
        symbol
        companyname
        industryname
        supersector
        sector
        subsector
        listingdate
        issueshare
        listedvalue
    }
    companyStatistics(symbol: "%s") {
        marketcap
    }
}
"""


HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
}


def get_symbols():
    """
    Get Symbols
    """
    stock_symbols_response = requests.post(
        url=GATEWAY_URL, json={"query": STOCK_SYMBOL_QUERY}, timeout=TIMEOUT)
    stock_symbols_json = stock_symbols_response.json()
    stock_symbols_data = stock_symbols_json.get("data", {})
    stock_symbols_hose = stock_symbols_data.get("hose", {})
    stock_symbols_hnx = stock_symbols_data.get("hnx", {})
    stock_symbols_upcom = stock_symbols_data.get("upcom", {})
    stock_symbols_vnindex = stock_symbols_hose + \
        stock_symbols_hnx + stock_symbols_upcom
    stock_symbols = list(map(lambda stock_symbol: stock_symbol.get(
        "stockSymbol", ""), stock_symbols_vnindex))
    stock_symbols = list(
        filter(lambda stock_symbol: len(stock_symbol) == 3, stock_symbols))
    stock_symbols.sort()
    print(stock_symbols)
    return stock_symbols


def get_companies():
    """
    Get Companies
    """
    stock_symbols = get_symbols()
    all_companies = []
    for stock_symbol in stock_symbols:
        print(stock_symbol)
        # Get Company Profile
        company_profile_query = COMPANY_PROFILE_QUERY % (
            stock_symbol, stock_symbol)
        try:
            company_profile_response = requests.post(
                url=INFO_URL,
                json={"query": company_profile_query},
                headers=HEADERS,
                timeout=TIMEOUT
            )
            company_profile_json = company_profile_response.json()
            company_profile_data = company_profile_json.get("data", {})
            company_profile = company_profile_data.get("companyProfile", {})
            company_statistics = company_profile_data.get(
                "companyStatistics", {})
            symbol = company_profile.get("symbol", "")
            name = company_profile.get("companyname", "")
            industry = company_profile.get("industryname", "")
            supersector = company_profile.get("supersector", "")
            sector = company_profile.get("sector", "")
            subsector = company_profile.get("subsector", "")
            listing_date = company_profile.get("listingdate", "")
            issue_share = company_profile.get("issueshare", "")
            listed_value = company_profile.get("issueshare", "")
            market_cap = company_statistics.get("marketcap", "")
            company = {
                "symbol": symbol,
                "name": name,
                "industry": industry,
                "supersector": supersector,
                "sector": sector,
                "subsector": subsector,
                "listing_date": listing_date,
                "issue_share": issue_share,
                "listed_value": listed_value,
                "market_cap": market_cap
            }
            all_companies.append(company)
        except Exception as ex:
            all_companies.append({
                "symbol": symbol,
                "name": "",
                "industry": "",
                "supersector": "",
                "sector": "",
                "subsector": "",
                "listing_date": "",
                "issue_share": "",
                "listed_value": "",
                "market_cap": ""
            })
    return all_companies


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
