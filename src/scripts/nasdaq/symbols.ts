import { writeFileSync } from 'fs';
import { convertCSVtoJSON } from '../../libs/csv-to-json';
import { convertJSONtoCSV } from '../../libs/json-to-csv';

const main = async () => {
  const list = await convertCSVtoJSON('./data/usa/stock/nasdaq.csv');
  const symbols = list.map((item: any) => {
    const symbol = item['Symbol'] || '';
    const name = item['Name'] || '';
    const country = item['Country'] || '';
    const sector = item['Sector'] || '';
    const industry = item['Industry'] || '';
    return { symbol, name, country, sector, industry };
  });
  const fields: string[] = ['symbol', 'name', 'country', 'sector', 'industry'];
  const csv = convertJSONtoCSV(symbols, fields);
  writeFileSync('./data/usa/stock/symbols.csv', csv);

  process.exit(0);
};

main().catch((error: Error) => console.error(error));
