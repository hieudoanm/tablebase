import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

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
        reject(error.response?.data);
      });
  });
};
