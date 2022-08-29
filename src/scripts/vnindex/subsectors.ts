import { writeFileSync } from 'fs';
import { convertCSVtoJSON } from '../../libs/csv-to-json';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import { Company } from '../../services/vnindex/vnindex.types';
import { fields } from './constants';

const main = async () => {
  const companies = await convertCSVtoJSON<Company>(
    './data/vietnam/stock/companies.csv'
  );

  const subsectors = companies
    .map((company) => company.subsector)
    .filter(
      (value: string, index: number, array: string[]) =>
        array.indexOf(value) === index
    )
    .map((value: string) => value.toLowerCase().split(' ').join('-'))
    .sort();
  console.log('subsectors', subsectors);

  for (const subsector of subsectors) {
    if (!subsector) continue;
    try {
      console.log('subsector', subsector);
      const filteredCompanies = companies.filter(
        (company) =>
          company.subsector.toLowerCase().split(' ').join('-') === subsector
      );

      const csv = convertJSONtoCSV<Company>(filteredCompanies, fields);
      writeFileSync(`./data/vietnam/stock/subsectors/${subsector}.csv`, csv);
    } catch (error) {
      console.error(error);
    }
  }

  process.exit(0);
};

main().catch((error: Error) => console.error(error));
