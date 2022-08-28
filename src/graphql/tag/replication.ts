import { gql } from '@apollo/client';
import { print } from 'graphql';
import { RxGraphQLReplicationPullQueryBuilder, RxGraphQLReplicationPushQueryBuilder, SyncOptionsGraphQL } from 'rxdb';
import { Tag, TagDocument } from '../../db/tag/model';
import { BASE_SYNC_OPTIONS, SYNC_BATCH_PULL_SIZE, SYNC_BATCH_PUSH_SIZE } from '../constants';

const pullQueryBuilder: RxGraphQLReplicationPullQueryBuilder<TagDocument> = (tag: TagDocument) => {
  if (!tag) {
    // the first pull does not have a start-document
    tag = {
      id: '',
      updatedAt: new Date(0).toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  }

  const query = gql`{
    feedForRxDBReplicationTag(lastFrontendId: "${tag.id}", minUpdatedAt: "${tag.updatedAt}", limit: ${SYNC_BATCH_PULL_SIZE}) {
          id: frontendId,
          name,
          updatedAt,
          deleted,
      }
  }`;

  return {
    query: print(query),
    variables: {},
  };
};

type TagCreateInput = {
  name: string;
  deleted: boolean;
  updatedAt: string;
  frontendId: string;
};

const pushQueryBuilder: RxGraphQLReplicationPushQueryBuilder = (tags: TagDocument[]) => {
  const query = gql`
    mutation CreateTags($tags: [TagCreateInput!]) {
      setRxDBReplicationTags(tags: $tags) {
        id # GraphQL does not allow returning void, so we return one id.
      }
    }
  `;

  const variables = {
    tags: tags.map((tag) => convertTagDocumentToGqlTag(tag)),
  };

  return {
    query: print(query),
    variables,
  };
};

export const syncOptionsGraphQL: SyncOptionsGraphQL<Tag> = {
  ...BASE_SYNC_OPTIONS,
  pull: {
    queryBuilder: pullQueryBuilder,
    modifier: (doc) => doc, // (optional) modifies all pulled documents before they are handeled by RxDB. Returning null will skip the document.
    dataPath: undefined, // (optional) specifies the object path to access the document(s). Otherwise, the first result of the response data is used.
    batchSize: SYNC_BATCH_PULL_SIZE,
  },
  push: {
    queryBuilder: pushQueryBuilder, // the queryBuilder from above
    batchSize: SYNC_BATCH_PUSH_SIZE,
    /**
     * modifier (optional)
     * Modifies all pushed documents before they are send to the GraphQL endpoint.
     * Returning null will skip the document.
     */
    modifier: (doc) => doc,
  },
};

function convertTagDocumentToGqlTag(tagDoc: TagDocument): TagCreateInput {
  return {
    frontendId: tagDoc.id || '',
    name: tagDoc.name || '',
    updatedAt: tagDoc.updatedAt || '',
    deleted: tagDoc.deleted,
  };
}
