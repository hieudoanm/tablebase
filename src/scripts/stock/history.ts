import { readdirSync, writeFileSync } from 'fs';
import difference from 'lodash/difference';
import uniq from 'lodash/uniq';
import { convertCSVtoJSON } from '../../libs/csv-to-json';
import { getDailyHistory } from '../../services/alpha-vantage';
import { MemberTransaction } from '../../types';
import sleep from '../../utils/sleep';

const main = async () => {
  const filePath = './data/transactions/senate/transactions.csv';
  const transactions = convertCSVtoJSON<MemberTransaction>(filePath);
  const symbols = uniq(
    transactions
      .filter(
        (transaction: MemberTransaction) =>
          transaction.assetType.toLowerCase().trim() === 'stock'
      )
      .map((transaction) => transaction.symbol)
  ).sort();

  const fileNames: string[] = await readdirSync('./data/stock/history');
  const existingSymbols: string[] = fileNames.map((fileName: string) =>
    fileName.replace(/.csv/g, '')
  );
  const differenceSymbols = difference(symbols, existingSymbols);

  for (const symbol of differenceSymbols) {
    console.log('symbol', symbol);
    const csv: string = await getDailyHistory(symbol);
    if (typeof csv === 'string') {
      await writeFileSync(`./data/stock/history/${symbol}.csv`, csv);
    } else {
      console.log(csv);
    }
    await sleep(15 * 1000);
  }

  process.exit(0);
};

main().catch((error) => console.error(error));
