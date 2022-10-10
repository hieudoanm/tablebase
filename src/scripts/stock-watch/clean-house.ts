import { writeFileSync } from 'fs';
import { convertCSVtoJSON } from '../../libs/csv-to-json';
import { convertJSONtoCSV } from '../../libs/json-to-csv';

const main = async () => {
  const filePath = './data/usa/stock-watch/house/all_transactions.csv';
  const allTransactions = convertCSVtoJSON(filePath);
  console.log(allTransactions);
  const transactions = allTransactions
    .map((transaction: any) => {
      const {
        disclosure_date,
        transaction_date: transactionDate,
        ticker: symbol,
        asset_description: asset,
        representative: fullName,
        type: action,
        amount,
        ptr_link: url,
      } = transaction;
      const [month, date, disclosureYear] = disclosure_date.split('/');
      const disclosureDate = `${disclosureYear}-${month}-${date}`;
      const processedName = fullName
        .replace(/Hon./g, '')
        .replace(/Mr./g, '')
        .trim()
        .split(' ');
      const firstName = processedName[0];
      const lastName = processedName[processedName.length - 1];
      return {
        symbol,
        action,
        fullName,
        firstName,
        lastName,
        amount,
        asset,
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

  const transactionsCSV = await convertJSONtoCSV(transactions);
  await writeFileSync(
    `./data/usa/stock-watch/house/transactions.csv`,
    transactionsCSV
  );
};

main().catch((error) => console.error(error));
