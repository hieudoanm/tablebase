import { retryGet } from '../../libs/axios';
import { Country } from './countries.types';

export const getCountries = async (): Promise<Country[]> => {
  const url = 'https://restcountries.com/v3/all';
  return retryGet<Country[]>(url);
};
