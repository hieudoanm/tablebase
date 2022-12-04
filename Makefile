csv2json:
	python3 ./scripts/csv-to-json.py

lock:
	pigar

usa-nasdaq:
	python3 ./scripts/usa/nasdaq.py

usa-nyse:
	python3 ./scripts/usa/nyse.py

vnindex-companies:
	python3 ./scripts/vietnam/vnindex/collect_move_store/companies.py

vnindex-history:
	python3 ./scripts/vietnam/vnindex/collect_move_store/history.py

vnindex-all-time:
	python3 ./scripts/vietnam/vnindex/explore_transform/all_time.py

vnindex-yearly:
	python3 ./scripts/vietnam/vnindex/explore_transform/yearly.py

vnindex-quarterly:
	python3 ./scripts/vietnam/vnindex/explore_transform/quarterly.py

vnindex-monthly:
	python3 ./scripts/vietnam/vnindex/explore_transform/monthly.py
