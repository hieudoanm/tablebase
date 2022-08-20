import fs from 'fs';
import get from 'lodash/get';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import {
  getCompanyProfile,
  getStockSymbols,
} from '../../services/vnindex/vnindex.service';

type Company = {
  symbol: string;
  market: string;
  name: string;
  industry: string;
  supersector: string;
  sector: string;
  subsector: string;
  listedDate: string;
  issueShare: number;
  marketCap: number;
};

const fields: string[] = [
  'symbol',
  'market',
  'name',
  'industry',
  'supersector',
  'sector',
  'subsector',
  'listedDate',
  'issueShare',
  'marketCap',
];

const saveCSV = async (companies: Company[]): Promise<void> => {
  const csv = convertJSONtoCSV<Company>(companies, fields);
  return fs.writeFileSync('./data/vietnam/stock/symbols.csv', csv);
};

const main = async (): Promise<void> => {
  const stocks = await getStockSymbols();
  console.log(stocks.length, stocks);

  const companies: Company[] = [];
  for (const stock of stocks) {
    const symbol: string = get(stock, 'symbol', '');
    const market: string = get(stock, 'market', '');
    if (!symbol) continue;
    const { profile, statistics } = await getCompanyProfile(symbol);
    const name: string = get(profile, 'companyname');
    const industry: string = get(profile, 'industryname');
    const supersector: string = get(profile, 'supersector');
    const sector: string = get(profile, 'sector');
    const subsector: string = get(profile, 'subsector');
    const [listingDate] = get(profile, 'listingdate').split(' ');
    const listedDate = listingDate.split('/').reverse().join('-');
    const issueShare: number = parseFloat(get(profile, 'issueshare', '0'));
    const marketCap: number = parseFloat(get(statistics, 'marketcap', '0'));
    console.log('stock', symbol, market, subsector, listedDate);
    const company: Company = {
      symbol,
      market,
      name,
      industry,
      supersector,
      sector,
      subsector,
      listedDate,
      issueShare,
      marketCap,
    };
    companies.push(company);
    await saveCSV(companies);
  }
};

main().catch((error: Error) => console.error(error));
