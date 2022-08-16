import get from 'lodash/get';
import { axiosGet } from '../../libs/axios';
import {
  USACongressRequest,
  USACongressCommitteesResponse,
  ProPublicaCongressResponse,
  Committee,
  CongressMember,
  Subcommittee,
  USACongressMembersResponse,
} from './congress.types';

const API_KEY_PROPUBLICA_CONGRESS =
  process.env.API_KEY_PROPUBLICA_CONGRESS || '';

const headers = { 'X-API-Key': API_KEY_PROPUBLICA_CONGRESS };

export const getCommittees = async ({
  chamber,
  congress,
}: USACongressRequest): Promise<USACongressCommitteesResponse> => {
  const url = `https://api.propublica.org/congress/v1/${congress}/${chamber}/committees.json`;
  const response: ProPublicaCongressResponse =
    await axiosGet<ProPublicaCongressResponse>(url, { headers });
  const status = get(response, 'status', '');
  if (status !== 'OK') return { total: 0, data: [] };
  const total = get(response, 'results.0.num_results', 0);
  const data = get(response, 'results.0.committees', 0);
  return { total, data };
};

export const getCommittee = async ({
  chamber,
  congress,
  id,
}: USACongressRequest): Promise<{ committee: Committee }> => {
  const url = `https://api.propublica.org/congress/v1/${congress}/${chamber}/committees/${id}.json`;
  const response: ProPublicaCongressResponse =
    await axiosGet<ProPublicaCongressResponse>(url, { headers });
  const status = get(response, 'status', '');
  if (status !== 'OK') return { committee: {} };
  const committee = get(response, 'results.0', {});
  return { committee };
};

export const getSubcommittee = async ({
  chamber,
  congress,
  committee,
  id,
}: USACongressRequest): Promise<{ subcommittee: Subcommittee }> => {
  const url = `https://api.propublica.org/congress/v1/${congress}/${chamber}/committees/${committee}/subcommittees/${id}.json`;
  const response: ProPublicaCongressResponse =
    await axiosGet<ProPublicaCongressResponse>(url, { headers });
  const status = get(response, 'status', '');
  if (status !== 'OK') return { subcommittee: {} };
  const subcommittee = get(response, 'results.0', {});
  return { subcommittee };
};

export const getMembers = async ({
  chamber = 'house',
  congress = 117,
}: USACongressRequest): Promise<USACongressMembersResponse> => {
  const url = `https://api.propublica.org/congress/v1/${congress}/${chamber}/members.json`;
  const response: ProPublicaCongressResponse =
    await axiosGet<ProPublicaCongressResponse>(url, { headers });
  const status = get(response, 'status', '');
  if (status !== 'OK') return { total: 0, data: [] };
  const total = get(response, 'results.0.num_results', 0);
  const data = get(response, 'results.0.members', 0);
  return { total, data };
};

export const getMember = async (
  id: string
): Promise<{ member: CongressMember }> => {
  const url = `https://api.propublica.org/congress/v1/members/${id}.json`;
  const response: ProPublicaCongressResponse =
    await axiosGet<ProPublicaCongressResponse>(url, { headers });
  const status = get(response, 'status', '');
  if (status !== 'OK') return { member: {} };
  const member = get(response, 'results.0', 0);
  return { member };
};
