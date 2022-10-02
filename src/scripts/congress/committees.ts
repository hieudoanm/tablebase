import dotenv from 'dotenv';
dotenv.config();

import { writeFileSync } from 'fs';
import range from 'lodash/range';
import { convertJSONtoCSV } from '../../libs/json-to-csv';
import {
  getCommittee,
  getCommittees,
  getSubcommittee,
} from '../../services/congress/congress.service';
import { CongressMember } from '../../services/congress/congress.types';

const CHAMBERS = ['senate', 'house'];
const CONGRESS = 117;

const saveCommitteesByChamber = async (congress: number, chamber: string) => {
  const { data = [] } = await getCommittees({ congress, chamber });

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
    const filePath = `./data/usa/congress/${congress}/${chamber}/committees.csv`;
    writeFileSync(filePath, committeeMembersCSV);
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
    const { name: subcommitteeName = '', current_members = [] } = subcommittee;

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
    const filePath = `./data/usa/congress/${congress}/${chamber}/subcommittees.csv`;
    writeFileSync(filePath, csv);
  }
};

const saveCommittees = async (congress: number) => {
  for (const chamber of CHAMBERS) {
    console.log('chamber', chamber);
    saveCommitteesByChamber(congress, chamber);
  }
};

const main = async () => {
  const congresses = range(80, CONGRESS + 1).reverse();

  for (const congress of congresses) {
    console.log('congress', congress);
    saveCommittees(congress);
  }
};

main().catch((error) => console.error(error));
