import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs';
import { convertCSVtoJSON } from '../../libs/csv-to-json';

const walk = (dir: string, rootDir: string): string[] => {
  let files: string[] = [];
  const list = readdirSync(dir);
  for (let file of list) {
    file = dir + '/' + file;
    const stat = statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      const list = walk(file, rootDir);
      files = files.concat(list);
    } else {
      /* Is a file */
      files.push(file);
    }
  }
  return files.map((file: string) => file.replace(rootDir, ''));
};

const main = async () => {
  const csvPaths: string[] = walk('./data', './data/');

  for (const csvPath of csvPaths) {
    try {
      const paths: string[] = csvPath.split('/');
      const fileName = paths[paths.length - 1];
      const folder = paths.slice(0, paths.length - 1).join('/');
      const jsonFolder = `json/${folder}`;
      const exist = existsSync(jsonFolder);
      if (!exist) mkdirSync(jsonFolder);
      const json = convertCSVtoJSON(`data/${csvPath}`);
      const jsonPath = `${jsonFolder}/${fileName}`.replace('csv', 'json');
      const jsonContent: string = JSON.stringify(json, null, 2);
      writeFileSync(jsonPath, jsonContent);
      console.log(exist, jsonFolder, fileName);
    } catch (error) {
      console.error(error);
    }
  }

  process.exit(0);
};

main().catch((error) => console.error(error));
