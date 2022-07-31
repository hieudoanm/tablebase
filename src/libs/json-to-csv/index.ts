import { parse } from 'json2csv';

export const convertJSONtoCSV = <T>(
  data: Array<T>,
  fields: Array<string>
): string => {
  try {
    const csv: string = parse(data, { fields });
    return csv;
  } catch (error) {
    console.error(error);
    return '';
  }
};
