csv2json:
	python3 ./scripts/csv-to-json.py

lock:
	pigar

nasdaq:
	python3 ./scripts/usa/nasdaq.py

nyse:
	python3 ./scripts/usa/nyse.py

vnindex-companies:
	python3 ./scripts/vietnam/vnindex/companies.py

vnindex-history:
	python3 ./scripts/vietnam/vnindex/history.py

vnindex-all-time:
	python3 ./scripts/vietnam/vnindex/all_time.py

vnindex-quarterly:
	python3 ./scripts/vietnam/vnindex/quarterly.py

vnindex-monthly:
	python3 ./scripts/vietnam/vnindex/monthly.py
