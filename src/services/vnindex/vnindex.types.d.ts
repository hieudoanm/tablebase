export type Company = {
  symbol: string;
  market: string;
  name: string;
  industry: string;
  supersector: string;
  sector: string;
  subsector: string;
  listedDate: string;
  issueShare: number;
  marketCap: number;
  priceChangedFiveDayPercent: string | number;
  priceChangedOneMonthPercent: string | number;
  priceChangedThreeMonthsPercent: string | number;
};
