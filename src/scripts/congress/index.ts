import dotenv from 'dotenv';
dotenv.config();

import { writeFileSync } from 'fs';
import range from 'lodash/range';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import {
  getCommittee,
  getCommittees,
  getMembers,
  getSubcommittee,
} from '../../services/congress/congress.service';
import { CongressMember } from '../../services/congress/congress.types';

const CHAMBERS = ['senate', 'house'];
const CONGRESS = 117;

const saveMembers = async (congress: number) => {
  for (const chamber of CHAMBERS) {
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

    if (members.length === 0) continue;
    const fields: string[] = [
      'id',
      'title',
      'firstName',
      'lastName',
      'name',
      'partyShort',
      'stateAbbreviation',
      'leadershipRole',
    ];
    const csv = convertJSONtoCSV(members, fields);
    const filePath = `./data/congress/${congress}/${chamber}/members.csv`;
    await writeFileSync(filePath, csv);
  }
};

const saveCommittees = async (congress: number) => {
  for (const chamber of CHAMBERS) {
    console.log('chamber', chamber);
    const { data = [] } = await getCommittees({ chamber, congress });

    let committeeMembers: any[] = [];
    let allSubcommittees: any[] = [];
    for (const item of data) {
      const { id } = item;

      const { committee } = await getCommittee({
        chamber,
        congress,
        id,
      });
      const {
        name: committeeName = '',
        current_members = [],
        subcommittees = [],
      } = committee;

      console.log('committee', id, committeeName, current_members.length);

      const members = current_members.map((member: CongressMember) => {
        const {
          id,
          name,
          state: stateAbbreviation,
          party: partyShort,
          side,
          rank_in_party: committeeRank,
          note,
        } = member;
        return {
          id,
          name,
          stateAbbreviation,
          partyShort,
          committeeId: id,
          committeeName,
          committeePosition: note || 'member',
          committeeSide: side,
          committeeRank,
        };
      });
      committeeMembers = committeeMembers.concat(members);

      const subcommittees2 = subcommittees.map((subcommittee) => {
        return { committee: id, id: subcommittee.id };
      });

      allSubcommittees = allSubcommittees.concat(subcommittees2);
    }

    if (committeeMembers.length > 0) {
      const fields = [
        'id',
        'name',
        'partyShort',
        'stateAbbreviation',
        'committeeId',
        'committeeName',
        'committeePosition',
        'committeeSide',
        'committeeRank',
      ];
      const committeeMembersCSV = convertJSONtoCSV(committeeMembers, fields);
      const filePath = `./data/congress/${congress}/${chamber}/committees.csv`;
      await writeFileSync(filePath, committeeMembersCSV);
    }

    let subcommitteeMembers: any[] = [];
    for (const item of allSubcommittees) {
      const { committee, id } = item;

      const { subcommittee } = await getSubcommittee({
        chamber,
        congress,
        committee,
        id,
      });
      const { name: subcommitteeName = '', current_members = [] } =
        subcommittee;

      console.log('subcommittee', id, subcommitteeName, current_members.length);

      const members = current_members.map((member: CongressMember) => {
        const {
          id,
          name,
          state: stateAbbreviation,
          party: partyShort,
          side,
          rank_in_party: subcommitteeRank,
          note,
        } = member;
        return {
          id,
          name,
          stateAbbreviation,
          partyShort,
          subcommitteeId: id,
          subcommitteeName,
          subcommitteePosition: note || 'member',
          subcommitteeSide: side,
          subcommitteeRank,
        };
      });
      subcommitteeMembers = subcommitteeMembers.concat(members);
    }

    if (subcommitteeMembers.length > 0) {
      const fields = [
        'id',
        'name',
        'partyShort',
        'stateAbbreviation',
        'subcommitteeId',
        'subcommitteeName',
        'subcommitteePosition',
        'subcommitteeSide',
        'subcommitteeRank',
      ];
      const csv = convertJSONtoCSV(subcommitteeMembers, fields);
      const filePath = `./data/congress/${congress}/${chamber}/subcommittees.csv`;
      await writeFileSync(filePath, csv);
    }
  }
};

const main = async () => {
  const congresses = range(80, CONGRESS + 1).reverse();

  for (const congress of congresses) {
    console.log('congress', congress);
    await saveMembers(congress);
    await saveCommittees(congress);
  }
};

main().catch((error) => console.error(error));
