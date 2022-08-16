import csv from 'csvtojson';
import { readFileSync } from 'fs';

export const convertCSVtoJSON = async <T>(
  csvFilePath: string
): Promise<Array<T>> => {
  try {
    const string = readFileSync(csvFilePath, 'utf-8');
    const array: Array<T> = await csv().fromString(string);
    return array;
  } catch (error) {
    console.error(error);
    return [];
  }
};
