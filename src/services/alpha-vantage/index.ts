import { API_KEY_ALPHA_VANTAGE } from '../../configs';
import axiosSync from '../../libs/axios';

export const getDailyHistory = async (symbol: string): Promise<string> => {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set('function', 'TIME_SERIES_DAILY');
  urlSearchParams.set('symbol', symbol);
  urlSearchParams.set('outputsize', 'full');
  urlSearchParams.set('datatype', 'csv');
  urlSearchParams.set('apikey', API_KEY_ALPHA_VANTAGE);
  const url = `https://www.alphavantage.co/query?${urlSearchParams.toString()}`;
  const data: string = await axiosSync<string>({ url });
  return data;
};
