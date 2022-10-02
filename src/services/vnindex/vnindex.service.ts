import { gql } from 'graphql-request';
import get from 'lodash/get';
import { axiosGet } from '../../libs/axios';
import getClient from '../../libs/graphql-request';

const realTimeURL = 'https://wgateway-iboard.ssi.com.vn/graphql';
const realTimeClient = getClient(realTimeURL);

const infoURL = 'https://finfo-iboard.ssi.com.vn/graphql';
const infoClient = getClient(infoURL);

export const GET_STOCK_SYMBOLS = gql`
  {
    hose: stockRealtimes(exchange: "hose") {
      stockSymbol
      exchange
    }
    hnx: stockRealtimes(exchange: "hnx") {
      stockSymbol
      exchange
    }
    upcom: stockRealtimes(exchange: "upcom") {
      stockSymbol
      exchange
    }
  }
`;

export const getStockSymbols = async () => {
  const data = await realTimeClient.request(GET_STOCK_SYMBOLS);
  return Object.values(data)
    .flat(Infinity)
    .map((value) => {
      const market = get(value, 'exchange').toUpperCase();
      const symbol = get(value, 'stockSymbol').toUpperCase();
      return { symbol, market };
    })
    .filter((stock) => stock.symbol.length === 3)
    .sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
};

export const GET_COMPANY_PROFILE = gql`
  query companyProfile($symbol: String!, $language: String) {
    companyProfile(symbol: $symbol, language: $language) {
      symbol
      companyname
      industryname
      supersector
      sector
      subsector
      listingdate
      issueshare
      listedvalue
    }
    companyStatistics(symbol: $symbol) {
      marketcap
    }
  }
`;

export type Profile = {
  companyname: string;
  industryname: string;
  supersector: string;
  sector: string;
  subsector: string;
  listingdate: string;
  issueshare: string;
};

export type Statistics = {
  marketcap: string;
};

export const getCompanyProfile = async (
  symbol: string
): Promise<{ profile: Profile; statistics: Statistics }> => {
  const data = await infoClient.request(GET_COMPANY_PROFILE, {
    symbol,
    language: 'en',
  });
  const profile = get(data, 'companyProfile', {});
  const statistics = get(data, 'companyStatistics', {});
  return { profile, statistics };
};

export type StockHistory = {
  date: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
};

export const getHistory = async ({
  symbol,
  from,
  to,
}: {
  symbol: string;
  from: number;
  to: number;
}): Promise<StockHistory[]> => {
  const url = `https://iboard.ssi.com.vn/dchart/api/history?resolution=D&symbol=${symbol}&from=${from}&to=${to}`;
  const data = await axiosGet(url);
  const arrayOfTimestamp: Array<number> = get(data, 't', []);
  const arrayOfOpen = get(data, 'o', []);
  const arrayOfHigh = get(data, 'h', []);
  const arrayOfLow = get(data, 'l', []);
  const arrayOfClose = get(data, 'c', []);
  const arrayOfVolume = get(data, 'v', []);
  return arrayOfTimestamp.map((timestamp: number, index: number) => {
    const open = parseFloat(arrayOfOpen[index]);
    const high = parseFloat(arrayOfHigh[index]);
    const low = parseFloat(arrayOfLow[index]);
    const close = parseFloat(arrayOfClose[index]);
    const volume = parseInt(arrayOfVolume[index], 10);
    const [date] = new Date(timestamp * 1000).toISOString().split('T');
    return { date, symbol, open, high, low, close, volume, timestamp };
  });
};

export const GET_SUB_COMPANIES = gql`
  query subCompanies($symbol: String!, $size: Int, $offset: Int) {
    subCompanies(symbol: $symbol, size: $size, offset: $offset) {
      datas {
        parentsymbol
        childsymbol
      }
      paging {
        pagesize
        currentpage
        totalpage
        totalrow
      }
    }
  }
`;

export const getSubSymbols = async (symbol: string) => {
  try {
    const data = await infoClient.request(GET_SUB_COMPANIES, {
      symbol,
      offset: 0,
      size: 2000,
    });
    return get(data, 'subCompanies.datas', [])
      .map((subCompany: { childsymbol: string }) => subCompany.childsymbol)
      .filter((childSymbol: string) => childSymbol)
      .sort();
  } catch (error) {
    return [];
  }
};
