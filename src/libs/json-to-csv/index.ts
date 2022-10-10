import { jsonToCSV } from '@hieudoanm/utils';

export const convertJSONtoCSV = <T>(
  data: Array<T>,
  headers: string[] = []
): string => {
  try {
    const csv: string = jsonToCSV(data, { delimiter: ',', headers });
    return csv;
  } catch (error) {
    console.error(error);
    return '';
  }
};
