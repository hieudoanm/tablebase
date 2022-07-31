import csv from 'csvtojson';

export const convertCSVtoJSON = async <T>(
  csvFilePath: string
): Promise<Array<T>> => {
  try {
    const array: Array<T> = await csv().fromFile(csvFilePath);
    return array;
  } catch (error) {
    console.error(error);
    return [];
  }
};
