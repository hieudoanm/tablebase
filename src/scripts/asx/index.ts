import { writeFileSync } from 'fs';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import { getCompanies, getCompany } from '../../services/asx/asx.service';
import { Company } from '../../services/asx/asx.types';

const saveCSV = (companies: any[]): void => {
  const csv = convertJSONtoCSV<any>(companies);
  writeFileSync('./data/australia/stock/companies.csv', csv);
};

const main = async (): Promise<void> => {
  const companies = await getCompanies();

  const sortedCompanies = companies
    .map((company: Company) => {
      const {
        symbol,
        displayName: name,
        industry: sector,
        dateListed: listedDate,
        marketCap,
      } = company;
      return { symbol, market: 'ASX', name, sector, listedDate, marketCap };
    })
    .sort((a, b) => (a.symbol > b.symbol ? 1 : -1));

  const allCompanies: any[] = [];
  for (const company of sortedCompanies) {
    let data = { numOfShares: 0, sector: '' };
    try {
      data = await getCompany(company.symbol);
    } catch (error) {
      console.error(error);
    }
    console.log(company.symbol, company.listedDate);
    const { numOfShares: issueShare, sector: industry } = data;
    allCompanies.push({ ...company, industry, issueShare });
    saveCSV(allCompanies);
  }
};

main().catch((error: Error) => console.error(error));
