import https from 'https';
import { GetValueByDateResponse, Holding } from './dragon-capital.types';

const BASE_URL = 'https://api.dragoncapital.com.vn';

export const getAvailableDates = async (
  productCode: string
): Promise<string[]> => {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set('trade_code', productCode);
  const queryParams = urlSearchParams.toString();
  console.log('queryParams', queryParams);
  const url = `${BASE_URL}/fundfactsheet/top_holdings/getValueByDate.php?${urlSearchParams}`;
  return new Promise((resolve) => {
    https.get(url, (response) => {
      const bytes: any[] = [];
      response.on('data', (chunk) => {
        bytes.push(chunk);
      });

      response.on('end', () => {
        const data: GetValueByDateResponse = JSON.parse(
          Buffer.concat(bytes).toString()
        );
        const { available_dates } = data;
        resolve(available_dates);
      });
    });
  });
};

export const getValueByDate = async (
  productCode: string,
  updatedDate: string
): Promise<Holding[]> => {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set('trade_code', productCode);
  urlSearchParams.set('date_upload', updatedDate);
  const url = `${BASE_URL}/fundfactsheet/top_holdings/getValueByDate.php?${urlSearchParams.toString()}`;
  return new Promise((resolve) => {
    https.get(url, (response) => {
      const bytes: any[] = [];
      response.on('data', (chunk) => {
        bytes.push(chunk);
      });

      response.on('end', () => {
        const data: GetValueByDateResponse = JSON.parse(
          Buffer.concat(bytes).toString()
        );
        const { ffs_holding } = data;
        resolve(ffs_holding);
      });
    });
  });
};
