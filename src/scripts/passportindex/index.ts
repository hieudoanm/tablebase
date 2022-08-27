import { writeFileSync } from 'fs';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import { getVisas } from '../../services/passportindex/passportindex.service';
import { Visa } from '../../services/passportindex/passportindex.types';

const fields: string[] = ['country', 'requirement'];

const main = async (): Promise<void> => {
  const countries = [
    'australia',
    'finland',
    'germany',
    'netherlands',
    'new-zealand',
    'singapore',
    'south-korea',
    'united-kingdom',
    'united-states-of-america',
    'viet-nam',
  ];
  for (const country of countries) {
    const visas: Visa[] = await getVisas();
    const csv = convertJSONtoCSV(visas, fields);
    writeFileSync(`./data/world/visas/${country}.csv`, csv);
  }

  process.exit(0);
};

main().catch((error: Error) => console.error(error));
