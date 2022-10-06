import { jsonToCSV } from '@hieudoanm/utils';

export const convertJSONtoCSV = <T>(data: Array<T>): string => {
  try {
    const csv: string = jsonToCSV(data);
    return csv;
  } catch (error) {
    console.error(error);
    return '';
  }
};
