/*
 * NOTE: This is not a good way to keep this info.
 * We should use a proper config file with environment variables.
 * For POC purposes, this should be fine.
 */

/**
 * Url of API endpoint for the sync GraphQL server.
 */
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
