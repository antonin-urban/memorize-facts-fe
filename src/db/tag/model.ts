import { RxCollection, RxDocument, RxJsonSchema } from 'rxdb';
import { v4 as uuidv4 } from 'uuid';
import handleDbError, { createDbErrorWarning } from '../helpers';

export type Tag = {
  id: string;
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
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
      maxLength: TagProperties.name.maxLenth,
    },
  },
  indexes: ['name'],
  required: ['name'],
};

export type TagCollection = RxCollection<Tag, undefined, TagCollectionMethods>;
export type TagDocument = RxDocument<Tag>;

// we declare one static ORM-method for the collection
type TagCollectionMethods = {
  insertTag(this: TagCollection, data: Omit<Tag, 'id'>): Promise<boolean>;
  deleteTag(this: TagCollection, data: Tag): Promise<boolean>;
  updateTag(this: TagCollection, tag: Tag, data: Omit<Tag, 'id'>): Promise<boolean>;
};

export const tagCollectionMethods: TagCollectionMethods = {
  insertTag: async function (this: TagCollection, data: Omit<Tag, 'id'>) {
    console.log(data.name);
    if (data?.name) {
      try {
        const query = this.findOne({
          selector: {
            name: data.name,
          },
        });

        const found = (await query.exec()) as TagDocument;

        if (found?.name) {
          createDbErrorWarning('Tag already exists');
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

  deleteTag: async function (this: TagCollection, data: Tag) {
    try {
      const query = this.findOne({
        selector: {
          id: data.id,
        },
      });

      const found = (await query.exec()) as TagDocument;

      if (found) {
        await found.remove();
        return true;
      } else {
        createDbErrorWarning('Tag not found');
        return false;
      }
    } catch (e) {
      handleDbError(e);
      return false;
    }
  },

  updateTag: async function (this: TagCollection, tag: Tag, data: Omit<Tag, 'id'>) {
    if (tag?.name) {
      try {
        console.debug('updateTag', tag);
        const query = this.findOne({
          selector: {
            id: tag.id,
          },
        });

        const found = (await query.exec()) as TagDocument;

        if (found.id) {
          await found.update({
            $set: {
              ...data,
            },
          });
          return true;
        } else {
          createDbErrorWarning('Tag not found');
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
};
