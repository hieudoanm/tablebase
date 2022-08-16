import { axiosGet } from '../../libs/axios';

export type Data = {
  count: number;
  totalCount: number;
  page: number;
  totalPages: number;
  results: Quote[];
};

export type Quote = {
  author: string;
  authorSlug: string;
  content: string;
  dateAdded: string;
  dateModified: string;
};

export const getQuotes = async (
  page: number
): Promise<{ totalPages: number; quotes: Quote[] }> => {
  const url = `https://api.quotable.io/quotes?page=${page}&limit=150`;
  const { totalPages, results = [] } = await axiosGet<Data>(url);
  const quotes = results.map(
    ({ author, content, authorSlug, dateAdded, dateModified }: Quote) => {
      return { author, content, authorSlug, dateAdded, dateModified };
    }
  );
  return { totalPages, quotes };
};
