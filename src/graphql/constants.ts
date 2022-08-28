import { gql } from '@apollo/client';
import { GQL_SERVER_URL } from '../config';

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
