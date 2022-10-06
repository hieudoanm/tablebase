import axios from '@hieudoanm/axios';
import { Country } from './countries.types';

export const getCountries = async (): Promise<Country[]> => {
  const url = 'https://restcountries.com/v3/all';
  return axios.get<Country[]>(url);
};
