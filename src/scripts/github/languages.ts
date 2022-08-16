import { writeFileSync } from 'fs';
import { getLanguages } from '../../services/github/github.service';

const main = async () => {
  try {
    const languages = await getLanguages();

    const keys: string[] = Object.keys(languages[0]);
    const csvHeaders = keys.join(',');
    const csvRows = languages
      .map((language) =>
        keys.map((key: string) => `"${language[key]}"`).join(',')
      )
      .join('\n');
    const csv = `${csvHeaders}\n${csvRows}`;
    writeFileSync('./data/github/languages.csv', csv);
    process.exit(0);
  } catch (error) {
    console.error('Error', error);
    process.exit(1);
  }
};

main().catch((error) => console.error(error));
