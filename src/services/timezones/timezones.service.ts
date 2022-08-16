import { retryGet } from '../../libs/axios';
import { TimeZone } from './timezones.types';

export const getTimeZones = async (): Promise<string[]> => {
  const url = 'http://worldtimeapi.org/api/timezone';
  return retryGet<string[]>(url);
};

export const getTimeZone = async (timeZone: string): Promise<TimeZone> => {
  const url = `http://worldtimeapi.org/api/timezone/${timeZone}`;
  return retryGet<TimeZone>(url);
};
