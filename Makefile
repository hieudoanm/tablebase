csv2json:
	python3 ./scripts/csv-to-json.py

lock:
	pigar

vnindex-companies:
	python3 ./scripts/vietnam/vnindex/companies.py

vnindex-history:
	python3 ./scripts/vietnam/vnindex/history.py
