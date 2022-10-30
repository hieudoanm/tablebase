import { writeFileSync } from 'fs';
import { convertCSVtoJSON } from '../../libs/csv-to-json';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import { getSubSymbols } from '../../services/vnindex/vnindex.service';
import { Company } from '../../services/vnindex/vnindex.types';

const main = async () => {
  const filePath = './data/vietnam/stock/companies.csv';
  const companies = convertCSVtoJSON<Company>(filePath);

  const companyTrees: Record<string, string[]> = {};

  for (const company of companies) {
    const { symbol } = company;
    const subSymbols = await getSubSymbols(symbol);
    console.log(symbol, 'subSymbols', subSymbols);
    if (subSymbols.length > 0) {
      companyTrees[symbol] = subSymbols;
    }
  }

  for (const parentSymbol in companyTrees) {
    if (!parentSymbol) continue;
    try {
      console.log('parentSymbol', parentSymbol);
      const childSymbols = companyTrees[parentSymbol];
      const filteredCompanies = companies.filter((company) =>
        childSymbols.includes(company.symbol)
      );

      const csv = convertJSONtoCSV(filteredCompanies);
      writeFileSync(
        `./data/vietnam/stock/subcompanies/${parentSymbol}.csv`,
        csv
      );
    } catch (error) {
      console.error(error);
    }
  }

  console.log('companyTrees', companyTrees);

  process.exit(0);
};

main().catch((error: Error) => console.error(error));
