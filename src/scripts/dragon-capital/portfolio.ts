import { writeFileSync } from 'fs';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import {
  getAvailableDates,
  getValueByDate,
} from '../../services/dragon-capital/dragon-capital.service';
import { Holding } from '../../services/dragon-capital/dragon-capital.types';

const capital = 'dragon-capital';
const portfolioCodes = ['dcbc', 'dcds'];

const main = async () => {
  for (const portfolioCode of portfolioCodes) {
    const availableDates = await getAvailableDates(portfolioCode);
    console.log('availableDates', availableDates);

    const availableDatesCSV = convertJSONtoCSV(
      availableDates.map((availableDate) => {
        return { capital, portfolioCode, availableDate };
      })
    );
    const availableDatesFilePath = `./data/vietnam/stock/capital/dragon-capital/${portfolioCode}/available-dates.csv`;
    writeFileSync(availableDatesFilePath, availableDatesCSV);

    let portfolio: any[] = [];
    for (const updatedDate of availableDates) {
      console.log('updatedDate', updatedDate);
      const values = await getValueByDate(portfolioCode, updatedDate);
      const stocks = values.map((value: Holding) => {
        const { stock, per_nav, bourse_en: market, sector_en: sector } = value;
        const percentage = parseFloat(per_nav);
        return {
          capital,
          portfolioCode,
          stockCode: stock,
          sector,
          market,
          updatedDate,
          percentage,
        };
      });

      portfolio = portfolio.concat(stocks);
    }

    const portfolioCSV = convertJSONtoCSV(portfolio);
    const portfolioFilePath = `./data/vietnam/stock/capital/dragon-capital/${portfolioCode}/portfolio.csv`;
    writeFileSync(portfolioFilePath, portfolioCSV);
  }
};

main().catch((error) => console.error(error));
