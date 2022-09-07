import { writeFileSync } from 'fs';
import { CHAMBERS } from '../../constants';
import { axiosGet } from '../../libs/axios';

const urls: Record<string, string> = {
  senate:
    'https://senate-stock-watcher-data.s3-us-west-2.amazonaws.com/aggregate/all_transactions.csv',
  house:
    'https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.csv',
};

const main = async () => {
  for (const chamber of CHAMBERS) {
    const url = urls[chamber];
    const data: string = await axiosGet<string>(url);
    const rows = data
      .split('\n')
      .map((line) => line.trim())
      .join('\n');
    await writeFileSync(
      `./data/usa/stock-watch/${chamber}/all_transactions.csv`,
      rows
    );
  }
};

main().catch((error) => console.error(error));
