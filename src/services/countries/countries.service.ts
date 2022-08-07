import { axiosGet } from '../../libs/axios';

export type Country = {
  name: { common: string; official: string };
  cca2: string;
  cca3: string;
  status: string;
  region: string;
  subregion: string;
};

export const getCountries = async (): Promise<Country[]> => {
  const url = 'https://restcountries.com/v3/all';
  return axiosGet(url);
};
