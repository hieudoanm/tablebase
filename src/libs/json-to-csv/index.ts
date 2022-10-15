import { jsonToCSV } from '@hieudoanm/utils';

export const convertJSONtoCSV = (
  data: any[],
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
