import axios from '@hieudoanm/axios';
import { TimeZone } from './timezones.types';

export const getTimeZones = async (): Promise<string[]> => {
  const url = 'http://worldtimeapi.org/api/timezone';
  return axios.get<string[]>(url);
};

export const getTimeZone = async (timeZone: string): Promise<TimeZone> => {
  const url = `http://worldtimeapi.org/api/timezone/${timeZone}`;
  return axios.get<TimeZone>(url);
};
