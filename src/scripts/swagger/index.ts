import { readdirSync, statSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';

const BASE_URL =
  'https://raw.githubusercontent.com/hieudoanm/tablebase/master/json';

const walk = (dir: string, rootDir: string): string[] => {
  let files: string[] = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const filePath = dir + '/' + file;
    const stat = statSync(filePath);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      const list = walk(filePath, rootDir);
      files = files.concat(list);
    } else {
      /* Is a file */
      files.push(filePath);
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
    let endpointPath = `/${cleanPath}`;
    if (
      endpointPath.includes('/usa/congress/house') ||
      endpointPath.includes('/usa/congress/senate')
    ) {
      endpointPath = '/usa/congress/${chamber}/${congress}/members';
    } else if (endpointPath.includes('/usa/stock/history')) {
      endpointPath = '/usa/stock/history/${symbol}';
    } else if (endpointPath.includes('/vietnam/stock/history')) {
      endpointPath = '/vietnam/stock/history/${symbol}';
    } else if (endpointPath.includes('/vietnam/stock/subcompanies')) {
      endpointPath = '/vietnam/stock/subcompanies/${symbol}';
    } else if (endpointPath.includes('/vietnam/stock/subsectors')) {
      endpointPath = '/vietnam/stock/subsectors/${symbol}';
    } else if (
      endpointPath.includes('/vietnam/vleague/cup/events') ||
      endpointPath.includes('/vietnam/vleague/v.league-1/events') ||
      endpointPath.includes('/vietnam/vleague/v.league-2/events')
    ) {
      endpointPath = '/vietnam/vleague/${competition}/events/${season}';
    } else if (
      endpointPath.includes('/vietnam/vleague/cup/fixtures') ||
      endpointPath.includes('/vietnam/vleague/v.league-1/fixtures') ||
      endpointPath.includes('/vietnam/vleague/v.league-2/fixtures')
    ) {
      endpointPath = '/vietnam/vleague/${competition}/fixtures/${season}';
    } else if (
      endpointPath.includes('/vietnam/vleague/cup/standings') ||
      endpointPath.includes('/vietnam/vleague/v.league-1/standings') ||
      endpointPath.includes('/vietnam/vleague/v.league-2/standings')
    ) {
      endpointPath = '/vietnam/vleague/${competition}/standings/${season}';
    } else if (endpointPath.includes('/world/visas')) {
      endpointPath = '/world/visas/${country}';
    }
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
