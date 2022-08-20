import { RxCollection, RxDocument, RxJsonSchema } from 'rxdb';

export type Tag = {
  name: string;
};

export type TagCollection = RxCollection<Tag>;
export type TagDocument = RxDocument<Tag>;

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
      maxLength: 50,
    },
  },
  //required: ['firstName', 'lastName', 'passportId'],
  //indexes: ['firstName'],
};
