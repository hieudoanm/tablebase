import { writeFileSync } from 'fs';
import { snakeCase } from 'lodash';
import { convertCSVtoJSON } from '../../libs/csv-to-json';
import { convertJSONtoCSV } from '../../libs/json-to-csv';

const main = async () => {
  const filePath = './data/usa/stock-watch/senate/all_transactions.csv';
  const allTransactions = convertCSVtoJSON(filePath);
  console.log(allTransactions);
  const transactions = allTransactions
    .map((transaction: any) => {
      const {
        disclosure_date,
        transaction_date,
        ticker: symbol,
        asset_type: assetType,
        asset_description: asset,
        senator: fullName,
        type,
        amount,
        ptr_link: url,
      } = transaction;
      const [dmonth, ddate, disclosureYear] = disclosure_date.split('/');
      const disclosureDate = `${disclosureYear}-${dmonth}-${ddate}`;
      const [tmonth, tdate, tyear] = transaction_date.split('/');
      const transactionDate = `${tyear}-${tmonth}-${tdate}`;
      const processedName = fullName
        .replace(/Jr./g, '')
        .replace(/,/g, '')
        .trim()
        .split(' ');
      const firstName = processedName[0];
      const lastName = processedName[processedName.length - 1];
      const action = snakeCase(type);
      return {
        symbol,
        action,
        fullName,
        firstName,
        lastName,
        amount,
        asset,
        assetType,
        disclosureYear,
        disclosureDate,
        transactionDate,
        url,
      };
    })
    .sort((a, b) => {
      if (a.fullName === b.fullName) {
        return a.disclosureDate < b.disclosureDate ? 1 : -1;
      }
      return a.fullName > b.fullName ? 1 : -1;
    });

  const transactionsCSV = await convertJSONtoCSV(transactions, [
    'symbol',
    'action',
    'fullName',
    'firstName',
    'lastName',
    'amount',
    'asset',
    'assetType',
    'disclosureYear',
    'disclosureDate',
    'transactionDate',
    'url',
  ]);
  await writeFileSync(
    `./data/usa/stock-watch/senate/transactions.csv`,
    transactionsCSV
  );
};

main().catch((error) => console.error(error));
