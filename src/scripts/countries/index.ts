import { writeFileSync } from 'fs';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import { getCountries } from '../../services/countries/countries.service';
import { Country } from '../../services/countries/countries.types';

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
        unMember,
        independent,
      } = country;
      return {
        common,
        official,
        cca2,
        cca3,
        status,
        region,
        subregion,
        unMember,
        independent,
      };
    })
    .sort((a, b) => (a.common > b.common ? 1 : -1));

  const csv = convertJSONtoCSV(table);
  writeFileSync(`./data/world/countries.csv`, csv);

  process.exit(0);
};

main().catch((error: Error) => console.error(error));
