import { RxCollection, RxDocument, RxJsonSchema } from 'rxdb';

export type Hero = {
  passportId: string;
  firstName: string;
  lastName: string;
  age?: number;
};

export type HeroCollection = RxCollection<Hero>;
export type HeroDocument = RxDocument<Hero>;

export const heroSchema: RxJsonSchema<Hero> = {
  title: 'hero schema',
  description: 'describes a human being',
  version: 0,
  keyCompression: true,
  primaryKey: 'passportId',
  type: 'object',
  properties: {
    passportId: {
      type: 'string',
      maxLength: 100,
    },
    firstName: {
      type: 'string',
      maxLength: 100,
    },
    lastName: {
      type: 'string',
    },
    age: {
      type: 'integer',
    },
  },
  required: ['firstName', 'lastName', 'passportId'],
  indexes: ['firstName'],
};
