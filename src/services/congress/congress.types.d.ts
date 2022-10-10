export type Subcommittee = {
  id?: string;
  name?: string;
  api_uri?: string;
  current_members?: CongressMember[];
};

export type Committee = {
  congress?: string;
  chamber?: string;
  id?: string;
  name?: string;
  url?: string;
  num_results?: number;
  api_uri?: string;
  chair?: string;
  chair_id?: string;
  chair_party?: string;
  chair_state?: string;
  chair_uri?: string;
  ranking_member_id?: string;
  current_members?: CongressMember[];
  former_members?: CongressMember[];
  subcommittees?: Subcommittee[];
};

export type CongressMember = {
  id?: string;
  title?: string;
  short_title?: string;
  api_uri?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  suffix?: string;
  date_of_birth?: string;
  gender?: string;
  party?: string;
  leadership_role?: string;
  twitter_account?: string;
  facebook_account?: string;
  youtube_account?: string;
  govtrack_id?: string;
  cspan_id?: string;
  votesmart_id?: string;
  icpsr_id?: string;
  crp_id?: string;
  google_entity_id?: string;
  fec_candidate_id?: string;
  url?: string;
  rss_url?: string;
  contact_form?: null;
  in_office?: boolean;
  cook_pvi?: null;
  dw_nominate?: number;
  ideal_point?: null;
  seniority?: string;
  next_election?: string;
  total_votes?: number;
  missed_votes?: number;
  total_present?: number;
  last_updated?: string;
  ocd_id?: string;
  office?: string;
  phone?: string;
  fax?: string;
  state?: string;
  district?: string | number;
  at_large?: boolean;
  geoid?: string;
  missed_votes_pct?: number;
  votes_with_party_pct?: number;
  votes_against_party_pct?: number;

  name?: string;
  side?: string;
  rank_in_party?: number;
  note?: string;

  roles?: Role[];
};

export type Role = {
  name: string;
};

export type USACongressRequest = {
  chamber?: string;
  congress?: number;
  committee?: string;
  id?: string;
};

export type USACongressCommitteesResponse = {
  total?: number;
  data?: Committee[];
};

export type USACongressMembersResponse = {
  total?: number;
  data?: CongressMember[];
};

export type ProPublicaCongressResult = {
  num_results: number;
  committees: Committee[];
  subcommittees: Subcommittee[];
  members: CongressMember[];
};

export type ProPublicaCongressResponse = {
  status: string;
  results: ProPublicaCongressResult[];
};

export type Member = {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  name: string;
  partyShort: string;
  stateAbbreviation: string;
  leadershipRole: string;
};

export type MemberTransaction = {
  symbol: string;
  asset: string;
  assetType: string;
  action: string;
  amount: string;
  firstName: string;
  lastName: string;
  disclosureYear: string;
  disclosureDate: string;
  transactionDate: string;
  url: string;
};

export type MemberCommitte = {
  id: string;
  name: string;
  partyShort: string;
  stateAbbreviation: string;
  committeeId: string;
  committeeName: string;
  committeePosition: string;
  committeeSide: string;
  committeeRank: string;
};

export type MemberSubcommittee = {
  id: string;
  name: string;
  partyShort: string;
  stateAbbreviation: string;
  subcommitteeId: string;
  subcommitteeName: string;
  subcommitteePosition: string;
  subcommitteeSide: string;
  subcommitteeRank: string;
};
