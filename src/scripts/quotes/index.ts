import { writeFileSync } from 'fs';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import { getQuotes, Quote } from '../../services/quotes/quotes.service';

const main = async (): Promise<void> => {
  const { totalPages } = await getQuotes(1);

  let allQuotes: Quote[] = [];
  for (let page = 1; page <= totalPages; page++) {
    console.info('page', page);
    const { quotes } = await getQuotes(page);
    allQuotes = allQuotes.concat(quotes);
  }
  allQuotes.sort((a, b) => (a.authorSlug > b.authorSlug ? 1 : -1));

  const csv = convertJSONtoCSV(allQuotes);
  writeFileSync(`./data/quotes/quotes.csv`, csv);

  process.exit(0);
};

main().catch((error: Error) => console.error(error));
