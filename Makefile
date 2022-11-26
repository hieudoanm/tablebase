csv2json:
	python3 ./scripts/csv-to-json.py

lock:
	pigar

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
