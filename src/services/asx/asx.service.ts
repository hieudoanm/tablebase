import { retryGet } from '../../libs/axios';
import { Company } from './asx.types';

const baseUrl = 'https://asx.api.markitdigital.com/asx-research/1.0/companies';

export const getCompanies = async (): Promise<Company[]> => {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set('page', '0');
  urlSearchParams.set('itemsPerPage', '3000');
  urlSearchParams.set('order', 'ascending');
  urlSearchParams.set('orderBy', 'companyName');
  urlSearchParams.set('includeFilterOptions', 'false');
  urlSearchParams.set('recentListingsOnly', 'false');
  const url = `${baseUrl}/directory?${urlSearchParams.toString()}`;
  const response = await retryGet<{ data: { items: Company[] } }>(url);
  const {
    data: { items = [] },
  } = response;
  return items;
};

export const getCompany = async (symbol: string) => {
  const headerUrl = `${baseUrl}/${symbol}/header`;
  const headerResponse = await retryGet<{ data: any }>(headerUrl);
  const { data: headerData } = headerResponse;
  const keyStatisticsUrl = `${baseUrl}/${symbol}/key-statistics`;
  const response = await retryGet<{ data: any }>(keyStatisticsUrl);
  const { data: keyStatisticsData } = response;
  return { ...headerData, ...keyStatisticsData };
};
