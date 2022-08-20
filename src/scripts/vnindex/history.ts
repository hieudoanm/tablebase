import { writeFileSync } from 'fs';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import { convertCSVtoJSON } from '../../libs/csv-to-json';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import { getHistory, StockHistory } from '../../services/stock/stock.service';

const fields: string[] = [
  'date',
  'symbol',
  'open',
  'high',
  'low',
  'close',
  'volume',
  'timestamp',
];

const main = async (): Promise<void> => {
  const companiesFilePath = './data/vietnam/stock/symbols.csv';
  const companies: Record<string, string>[] = await convertCSVtoJSON(
    companiesFilePath
  );

  const from = Math.floor(new Date(0).getTime() / 1000);
  const toD = new Date();
  const toYear = toD.getFullYear();
  const toMonth = toD.getMonth();
  const toDate = toD.getDate();
  const to = Math.floor(new Date(toYear, toMonth, toDate).getTime() / 1000);

  for (const company of companies) {
    const stockSymbol = get(company, 'symbol', '');
    const historyFilePath = `./data/vietnam/stock/history/${stockSymbol}.csv`;
    const oldHistory: StockHistory[] = await convertCSVtoJSON<StockHistory>(
      historyFilePath
    );
    const newHistory = await getHistory({ symbol: stockSymbol, from, to });
    console.log('history', stockSymbol);
    const allHistory = newHistory.concat(oldHistory);
    const uniqueHistory = uniqBy(allHistory, 'date').map(
      ({
        date,
        symbol,
        open,
        high,
        low,
        close,
        volume,
        timestamp,
      }: StockHistory) => {
        return {
          date,
          symbol,
          open: parseFloat(open.toString()),
          high: parseFloat(high.toString()),
          low: parseFloat(low.toString()),
          close: parseFloat(close.toString()),
          volume: volume,
          timestamp: parseFloat(timestamp.toString()),
        };
      }
    );
    const csv = convertJSONtoCSV(uniqueHistory, fields);
    writeFileSync(historyFilePath, csv);
  }

  process.exit(0);
};

main().catch((error: Error) => console.error(error));
