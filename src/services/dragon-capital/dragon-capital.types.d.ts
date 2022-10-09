export type GetValueByDateResponse = {
  ffs_holding: Holding[];
  date_upload: string;
  available_dates: string[];
};

export type Holding = {
  id: string;
  fund_id: string;
  created: string;
  modified: string;
  stock: string;
  sector_vi: string;
  sector_en: string;
  bourse_vi: string;
  bourse_en: string;
  per_nav: string;
  data_index_id: string;
  shares: string;
  market_value: string;
  foreign_ownership: string;
};
