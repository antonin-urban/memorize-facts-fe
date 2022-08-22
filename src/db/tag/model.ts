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
  insertTag(this: TagCollection, data: Tag): Promise<boolean>;
  deleteTag(this: TagCollection, data: Tag): Promise<boolean>;
  updateTag(this: TagCollection, tag: Tag, data: Tag): Promise<boolean>;
};

export const tagCollectionMethods: TagCollectionMethods = {
  insertTag: async function (this: TagCollection, data: Tag) {
    if (data?.name) {
      try {
        await this.insert(data);
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
    if (data?.name) {
      try {
        console.debug('deleteTag', data);
        const found = this.findOne({
          selector: {
            name: data.name,
          },
        });
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
    } else {
      createDbErrorWarning('Name must be set');
      return false;
    }
  },

  updateTag: async function (this: TagCollection, tag: Tag, data: Tag) {
    if (tag?.name) {
      try {
        console.debug('updateTag', tag);
        const found = this.findOne({
          selector: {
            name: tag.name,
          },
        });
        console.debug('found', found);
        if (found) {
          await found.update(data);
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
