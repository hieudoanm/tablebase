import { writeFileSync } from 'fs';
import uniqBy from 'lodash/uniqBy';
import { convertCSVtoJSON } from '../../libs/csv-to-json';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import {
  getHistory,
  StockHistory,
} from '../../services/vnindex/vnindex.service';
import { Company } from '../../services/vnindex/vnindex.types';

const main = async (): Promise<void> => {
  const companiesFilePath = './data/vietnam/stock/companies.csv';
  const companies: Company[] = convertCSVtoJSON<Company>(companiesFilePath);

  const from = Math.floor(new Date(0).getTime() / 1000);
  const toD = new Date();
  const toYear = toD.getFullYear();
  const toMonth = toD.getMonth();
  const toDate = toD.getDate();
  const to = Math.floor(new Date(toYear, toMonth, toDate).getTime() / 1000);

  for (const company of companies) {
    const stockSymbol = company.symbol || '';
    if (!stockSymbol) continue;
    const historyFilePath = `./data/vietnam/stock/history/${stockSymbol}.csv`;
    const oldHistory: StockHistory[] =
      convertCSVtoJSON<StockHistory>(historyFilePath);
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
    const csv = convertJSONtoCSV(uniqueHistory);
    writeFileSync(historyFilePath, csv);
  }

  process.exit(0);
};

main().catch((error: Error) => console.error(error));
