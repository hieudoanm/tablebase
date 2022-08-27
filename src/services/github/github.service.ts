import yaml from 'js-yaml';
import { axiosGet } from '../../libs/axios';

export const getLanguages = async () => {
  const url =
    'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml';
  const data = await axiosGet<string>(url);
  const json: Record<string, any> = yaml.load(data) as Record<string, any>;
  const allLanguages = Object.keys(json).map((key) => {
    const language = json[key];
    return { ...language, language: key };
  });
  const allKeys = allLanguages
    .map((language) => Object.keys(language))
    .flat()
    .sort()
    .filter((value, index, array) => array.indexOf(value) === index);
  const languages = allLanguages.map((l) => {
    const language: Record<string, any> = {};
    for (const key of allKeys) {
      language[key] = l[key] || '';
    }
    return language;
  });
  return languages;
};
