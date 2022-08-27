import { GraphQLClient } from 'graphql-request';

export const getClient = (url: string): GraphQLClient => {
  return new GraphQLClient(url);
};

export default getClient;
