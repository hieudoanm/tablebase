import { csvToJSON } from '@hieudoanm/utils';
import { readFileSync } from 'fs';

export const convertCSVtoJSON = <T>(csvFilePath: string): T[] => {
  try {
    const string = readFileSync(csvFilePath, { encoding: 'utf-8' });
    const array: T[] = csvToJSON(string) as T[];
    return array;
  } catch (error) {
    console.error(error);
    return [];
  }
};
