import { writeFileSync } from 'fs';
import { convertCSVtoJSON } from '../../libs/csv-to-json';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import {
  getTimeZone,
  getTimeZones,
} from '../../services/timezones/timezones.service';
import { TimeZone } from '../../services/timezones/timezones.types';

const main = async (): Promise<void> => {
  const timeZones = await getTimeZones();
  console.info('timeZones', timeZones.length);
  const filePath = `./data/world/timezones.csv`;

  const allTimeZones: TimeZone[] = convertCSVtoJSON<TimeZone>(filePath);
  for (const timeZone of timeZones) {
    try {
      console.info('timeZone', timeZone);
      if (!timeZone) continue;

      const exists = allTimeZones.findIndex(
        (tz) => tz.timezone.toLowerCase() === timeZone.toLowerCase()
      );
      if (exists > -1) continue;

      const {
        abbreviation,
        timezone,
        dst,
        dst_offset,
        utc_offset,
        raw_offset,
      } = await getTimeZone(timeZone);
      allTimeZones.push({
        abbreviation,
        timezone,
        dst,
        dst_offset,
        utc_offset,
        raw_offset,
      });
    } catch (error) {
      console.error('error', error);
    }
  }
  allTimeZones.sort((a, b) => (a.timezone > b.timezone ? 1 : -1));

  const csv = convertJSONtoCSV(allTimeZones);
  writeFileSync(filePath, csv);

  process.exit(0);
};

main().catch((error: Error) => console.error(error));
