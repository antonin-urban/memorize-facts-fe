import { RxCollection, RxDocument, RxJsonSchema } from 'rxdb';
import handleDbError, { createDbErrorWarning } from '../helpers';

export type Tag = {
  name: string;
};

export const TagProperties = {
  name: {
    minLength: 3,
    maxLenth: 10,
  },
};

export const tagSchema: RxJsonSchema<Tag> = {
  title: 'tag schema',
  description: 'tags used to categorize facts',
  version: 0,
  keyCompression: true,
  primaryKey: 'name',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: TagProperties.name.maxLenth,
    },
  },
};

export type TagCollection = RxCollection<Tag, undefined, TagCollectionMethods>;
export type TagDocument = RxDocument<Tag>;

// we declare one static ORM-method for the collection
type TagCollectionMethods = {
  insertRecord(this: TagCollection, data: Tag, callback?: () => void): Promise<void>;
};

export const tagCollectionMethods: TagCollectionMethods = {
  insertRecord: async function (this: TagCollection, data: Tag, callback?: () => void) {
    if (data?.name) {
      try {
        console.log('insertRecord', data);
        await this.insert(data);
        return;
      } catch (e) {
        handleDbError(e, callback);
      }
    } else {
      createDbErrorWarning('Name must be set', callback);
    }
  },
};
