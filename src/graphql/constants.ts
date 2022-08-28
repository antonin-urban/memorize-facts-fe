import { gql } from '@apollo/client';

export const GQL_SERVER_URL = 'https://memorize-facts-backend.herokuapp.com/api/graphql';

/**
 * Amount of documents that the remote will send in one request.
 * If the response contains less then [batchSize] documents,
 * RxDB will assume there are no more changes on the backend
 * that are not replicated.
 * This value is the same as the limit in the feedForRxDBReplication() schema.
 */
export const SYNC_BATCH_PULL_SIZE = 5;

/**
 * batchSize (optional)
 * Amount of document that will be pushed to the server in a single request.
 */
export const SYNC_BATCH_PUSH_SIZE = undefined; //no batching

export const BASE_SYNC_OPTIONS = {
  url: GQL_SERVER_URL, // url to the GraphQL endpoint
  deletedFlag: 'deleted', // the flag which indicates if a pulled document is deleted
  live: true, // if this is true, rxdb will watch for ongoing changes and sync them, when false, a one-time-replication will be done
  /**
   * Time in milliseconds after when a failed replication cycle
   * has to be retried.
   * (optional), default is 5 seconds.
   */
  retryTime: 5 * 60 * 1000, // 5 minutes
};

export const LOGIN_QUERY = gql`
  mutation authenticateUserWithPassword($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      __typename
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;
