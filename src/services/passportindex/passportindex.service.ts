import { load } from 'cheerio';
import { retryGet } from '../../libs/axios';
import { Visa } from './passportindex.types';

export const getVisas = async (country = 'viet-nam'): Promise<Visa[]> => {
  const url = `https://www.passportindex.org/passport/${country}/`;
  const html: string = await retryGet<string>(url);
  const $ = load(html);

  return $('table#psprt-dashboard-table tbody tr')
    .get()
    .map((row) => {
      const $row = $(row);
      const country = $row.find('td:nth-child(1)').text().trim();
      const requirement = $row.find('td:nth-child(2)').text().trim();

      return { country, requirement };
    });
};
