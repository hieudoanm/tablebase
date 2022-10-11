import dotenv from '@hieudoanm/dotenv';
dotenv.config();

import { writeFileSync } from 'fs';
import range from 'lodash/range';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import { getMembers } from '../../services/congress/congress.service';
import { CongressMember } from '../../services/congress/congress.types';
import { CHAMBERS, CONGRESS } from './constants';

const saveMembersByChamber = async (congress: number, chamber: string) => {
  const { data = [] } = await getMembers({ chamber, congress });
  const members = data
    .filter((member: CongressMember) =>
      congress === CONGRESS ? member.in_office : true
    )
    .map((member: CongressMember) => {
      const {
        id = '',
        title,
        first_name: firstName,
        last_name: lastName,
        state: stateAbbreviation,
        party: partyShort,
        leadership_role = '',
      } = member;
      const name = `${firstName} ${lastName}`;
      return {
        id,
        title,
        firstName,
        lastName,
        name,
        stateAbbreviation,
        partyShort,
        leadershipRole: leadership_role || '',
      };
    })
    .sort((a, b) => (a.id > b.id ? 1 : -1));

  if (members.length === 0) return;
  const csv = convertJSONtoCSV(members);
  const filePath = `./data/usa/congress/${congress}/${chamber}/members.csv`;
  writeFileSync(filePath, csv);
};

const saveMembers = async (congress: number) => {
  for (const chamber of CHAMBERS) {
    saveMembersByChamber(congress, chamber);
  }
};

const main = async () => {
  const congresses = range(80, CONGRESS + 1).reverse();

  for (const congress of congresses) {
    console.log('congress', congress);
    saveMembers(congress);
  }
};

main().catch((error) => console.error(error));
