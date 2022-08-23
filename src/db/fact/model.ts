import { RxCollection, RxDocument, RxJsonSchema } from 'rxdb';
import { v4 as uuidv4 } from 'uuid';
import handleDbError, { createDbErrorWarning } from '../helpers';
import { Tag } from '../tag/model';

export type Fact = {
  id: string;
  name: string;
  description: string;
  deadline?: Date;
  active?: boolean;
  tags?: string[];
};

export const FactProperties = {
  name: {
    minLength: 3,
    maxLenth: 10,
  },
};

export const factSchema: RxJsonSchema<Fact> = {
  title: 'fact schema',
  description: 'Fact to remember',
  version: 0,
  keyCompression: true,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
      maxLength: FactProperties.name.maxLenth,
    },
    description: {
      type: 'string',
    },
    deadline: {
      type: 'date',
    },
    active: {
      type: 'boolean',
    },
    tags: {
      type: 'array',
      ref: 'facts',
      items: {
        type: 'string',
      },
    },
  },
  indexes: ['name'],
  required: ['name', 'description'],
};

export type FactCollection = RxCollection<Fact, FactDocMethods, FactCollectionMethods>;
export type FactDocument = RxDocument<Fact, FactDocMethods>;

type FactDocMethods = {
  addTag(this: FactDocument, tagId: string): Promise<boolean>;
  removeTag(this: FactDocument, tagId: string): Promise<boolean>;
};

type FactCollectionMethods = {
  insertFact(this: FactCollection, data: Omit<Fact, 'id'>): Promise<boolean>;
  deleteFact(this: FactCollection, data: Fact): Promise<boolean>;
  updateFact(this: FactCollection, fact: Fact, data: Omit<Fact, 'id'>): Promise<boolean>;
  getFactByName(this: FactCollection, name: string): Promise<FactDocument | null>;
  getFact(this: FactCollection, id: string): Promise<FactDocument | null>;
};

export const factDocumentMethods: FactDocMethods = {
  addTag: async function (this: FactDocument, tagId: string): Promise<boolean> {
    console.log(tagId);
    try {
      await this.update({
        $set: {
          tags: [...this.tags, tagId],
        },
      });
      return true;
    } catch (e) {
      handleDbError(e);
      return false;
    }
  },

  removeTag: async function (this: FactDocument, tagId: string): Promise<boolean> {
    try {
      const newTags = this.tags.filter((tag) => tag !== tagId);
      await this.update({
        $set: {
          tags: [...newTags],
        },
      });
      return true;
    } catch (e) {
      handleDbError(e);
      return false;
    }
  },
};

export const factCollectionMethods: FactCollectionMethods = {
  insertFact: async function (this: FactCollection, data: Omit<Fact, 'id'>) {
    console.log(data.name);
    if (data?.name) {
      try {
        const found = await this.getFactByName(data.name);

        if (found?.name) {
          createDbErrorWarning('Fact already exists');
          return false;
        }

        await this.insert({
          id: uuidv4(),
          ...data,
        });
        return true;
      } catch (e) {
        handleDbError(e);
        return false;
      }
    } else {
      createDbErrorWarning('Name must be set');
      return false;
    }
  },

  deleteFact: async function (this: FactCollection, data: Fact) {
    try {
      const found = await this.getFact(data.id);
      if (found) {
        await found.remove();
        return true;
      } else {
        createDbErrorWarning('Fact not found');
        return false;
      }
    } catch (e) {
      handleDbError(e);
      return false;
    }
  },

  updateFact: async function (this: FactCollection, fact: Fact, data: Omit<Fact, 'id'>) {
    if (fact?.name) {
      try {
        const found = await this.getFact(fact.id);

        if (found?.id) {
          const foundByName = await this.getFactByName(data.name);
          if (foundByName) {
            createDbErrorWarning('Fact already exists');
            return false;
          }

          await found.update({
            $set: {
              ...data,
            },
          });
          return true;
        } else {
          createDbErrorWarning('Fact not found');
          return false;
        }
      } catch (e) {
        handleDbError(e);
        return false;
      }
    } else {
      createDbErrorWarning('Name must be set');
      return false;
    }
  },

  getFact: async function (this: FactCollection, id: string): Promise<FactDocument | null> {
    const query = this.findOne({
      selector: {
        id,
      },
    });

    return query
      .exec()
      .then((result: FactDocument) => {
        return result;
      })
      .catch((e) => {
        handleDbError(e);
        return null;
      });
  },

  getFactByName: async function (this: FactCollection, name: string): Promise<FactDocument | null> {
    const query = this.findOne({
      selector: {
        name,
      },
    });

    return query
      .exec()
      .then((result: FactDocument) => {
        return result;
      })
      .catch((e) => {
        handleDbError(e);
        return null;
      });
  },
};
