import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const axiosGet = <T>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, config)
      .then((response: AxiosResponse) => {
        resolve(response.data);
      })
      .catch((error: AxiosError) => {
        reject(error);
      });
  });
};

export const retryGet = async <T>(
  url: string,
  config: AxiosRequestConfig = {},
  max = 4,
  time = 0
): Promise<T> => {
  try {
    return await axiosGet<T>(url, config);
  } catch (error) {
    console.error('AxiosError', (error as AxiosError).stack);
    if (time > max) throw new Error((error as AxiosError).stack);
    const nextTime = time + 1;
    return retryGet<T>(url, config, max, nextTime);
  }
};
