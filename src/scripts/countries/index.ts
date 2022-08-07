import { writeFileSync } from 'fs';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import {
  Country,
  getCountries,
} from '../../services/countries/countries.service';

const fields: string[] = [
  'common',
  'official',
  'cca2',
  'cca3',
  'status',
  'region',
  'subregion',
];

const main = async (): Promise<void> => {
  const countries = await getCountries();

  const table = countries
    .map((country: Country) => {
      const {
        name: { common, official },
        cca2,
        cca3,
        status,
        region,
        subregion,
      } = country;
      return { common, official, cca2, cca3, status, region, subregion };
    })
    .sort((a, b) => (a.common > b.common ? 1 : -1));

  const csv = convertJSONtoCSV(table, fields);
  await writeFileSync(`./data/countries/countries.csv`, csv);

  process.exit(0);
};

main().catch((error: Error) => console.error(error));
