import fs from 'fs';
import { convertCSVtoJSON } from '../../libs/csv-to-json';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import {
  getCompanyProfile,
  getStockSymbols,
  StockHistory,
} from '../../services/vnindex/vnindex.service';
import { Company } from '../../services/vnindex/vnindex.types';

const saveCSV = async (companies: Company[]): Promise<void> => {
  const csv = convertJSONtoCSV<Company>(companies);
  return fs.writeFileSync('./data/vietnam/stock/companies.csv', csv);
};

const getPriceChanged = async (
  history: StockHistory[],
  gap: number[] = [2, 3, 4, 5, 6]
): Promise<string | number> => {
  const oneDay = 1000 * 60 * 60 * 24;
  const d = new Date();
  const day = d.getDay() || 8;
  const dates: string[] = [];
  if (day > 6) {
    for (const i of gap) {
      const [date] = new Date(d.getTime() - oneDay * (day - i))
        .toISOString()
        .split('T');
      dates.push(date);
    }
  }

  const recentDates = history
    .filter((item) => dates.includes(item.date))
    .sort((a: StockHistory, b: StockHistory) => (a.date < b.date ? 1 : -1));

  let priceChangedPercent: string | number = 'N/A';
  if (recentDates.length === gap.length) {
    const firstClose = parseFloat(recentDates[0].close.toString());
    const lastClose = parseFloat(
      recentDates[recentDates.length - 1].close.toString()
    );
    const diff = firstClose - lastClose;
    priceChangedPercent = parseFloat(((diff / firstClose) * 100).toFixed(2));
  }

  return priceChangedPercent;
};

const main = async (): Promise<void> => {
  const stocks = await getStockSymbols();
  console.log(stocks.length);

  const companies: Company[] = [];
  for (const stock of stocks) {
    const symbol: string = stock.symbol || '';
    const market: string = stock.market || '';
    if (!symbol) continue;
    const { profile, statistics } = await getCompanyProfile(symbol);
    const name: string = profile.companyname || '';
    const industry: string = profile.industryname || '';
    const supersector: string = profile.supersector || '';
    const sector: string = profile.sector || '';
    const subsector: string = profile.subsector;
    const [listingDate] = (profile.listingdate || '').split(' ');
    const listedDate = listingDate.split('/').reverse().join('-');
    const issueShare: number = parseFloat(profile.issueshare || '0');
    const marketCap: number = parseFloat(statistics.marketcap || '0');
    console.log('stock', symbol, market, subsector, listedDate);

    const historyFilePath = `./data/vietnam/stock/history/${symbol}.csv`;
    const history: StockHistory[] =
      convertCSVtoJSON<StockHistory>(historyFilePath);

    const oneWeek = [2, 3, 4, 5, 6];
    const twoWeek = [-5, -4, -3, -2, -1];
    const threeWeek = [-12, -11, -10, -9, -8];
    const fourWeek = [-19, -18, -17, -16, -15];
    const fiveWeek = [-26, -25, -24, -23, -22];
    const sixWeek = [-33, -32, -31, -30, -29];
    const sevenWeek = [-40, -39, -38, -37, -36];
    const eightWeek = [-47, -46, -45, -44, -43];
    const nineWeek = [-54, -53, -52, -51, -50];
    const tenWeek = [-61, -60, -59, -58, -57];
    const elevenWeek = [-68, -67, -66, -65, -64];
    const twelveWeek = [-75, -74, -73, -72, -71];

    const lastFiveDays = oneWeek;
    const priceChangedFiveDayPercent: string | number = await getPriceChanged(
      history,
      lastFiveDays
    );
    const lastOneMonth = oneWeek.concat(twoWeek, threeWeek, fourWeek);
    const priceChangedOneMonthPercent: string | number = await getPriceChanged(
      history,
      lastOneMonth
    );
    const lastThreeMonths = oneWeek.concat(
      twoWeek,
      threeWeek,
      fourWeek,
      fiveWeek,
      sixWeek,
      sevenWeek,
      eightWeek,
      nineWeek,
      tenWeek,
      elevenWeek,
      twelveWeek
    );
    const priceChangedThreeMonthsPercent: string | number =
      await getPriceChanged(history, lastThreeMonths);

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
      priceChangedFiveDayPercent,
      priceChangedOneMonthPercent,
      priceChangedThreeMonthsPercent,
    };
    companies.push(company);
    await saveCSV(companies);
  }

  const subsectors = companies
    .map((company) => company.subsector)
    .filter(
      (value: string, index: number, array: string[]) =>
        array.indexOf(value) === index
    )
    .map((value: string) => value.toLowerCase().split(' ').join('-'))
    .sort();
  console.log(subsectors);
};

main().catch((error: Error) => console.error(error));
