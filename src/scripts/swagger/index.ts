import { readdirSync, statSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';

const BASE_URL =
  'https://raw.githubusercontent.com/hieudoanm/tablebase/master/json';

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

const base = {
  info: {
    title: 'tablebase',
    version: '0.0.1',
    description: 'TableBase API',
    license: {
      name: 'MIT',
    },
    contact: {
      name: 'hieudoanm',
      email: 'hieumdoan@gmail.com',
    },
  },
  openapi: '3.0.0',
  servers: [{ url: BASE_URL }],
};

const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const main = async () => {
  const jsonPaths: string[] = walk('./json', './json/');

  const paths: Record<string, object> = {};
  for (const path of jsonPaths) {
    const cleanPath = path.replace('.json', '');
    const operationId = `Get${cleanPath
      .split('/')
      .map((item) => capitalize(item))
      .join('')}`;
    const description = cleanPath
      .split('/')
      .map((item) => capitalize(item))
      .join(' ');
    const tag = capitalize(cleanPath.split('/')[0]);
    const endpointPath = `/${cleanPath}`;
    paths[endpointPath] = {
      get: {
        operationId,
        responses: {
          '200': {
            description: `Get ${description}`,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                },
              },
            },
          },
        },
        tags: [tag],
        security: [],
        parameters: [],
      },
    };
  }

  const jsonString = JSON.stringify({ ...base, paths }, null, 2);
  writeFileSync('./docs/swagger.json', jsonString);
  const yamlString = yaml.dump({ ...base, paths });
  writeFileSync('./docs/swagger.yaml', yamlString);
};

main().catch((error) => console.error(error));
