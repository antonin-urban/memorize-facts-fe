import { RxCollection, RxDocument, RxJsonSchema } from 'rxdb';
import { v4 as uuidv4 } from 'uuid';
import { createErrorWarning, handleDbError } from '../helpers';

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
  getTagByName(this: TagCollection, name: string): Promise<TagDocument | null>;
  getTag(this: TagCollection, id: string): Promise<TagDocument | null>;
};

export const tagCollectionMethods: TagCollectionMethods = {
  insertTag: async function (this: TagCollection, data: Omit<Tag, 'id'>) {
    if (data?.name) {
      try {
        const found = await this.getTagByName(data.name);

        if (found?.name) {
          createErrorWarning('Tag already exists');
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
      createErrorWarning('Name must be set');
      return false;
    }
  },

  deleteTag: async function (this: TagCollection, data: Tag) {
    try {
      const found = await this.getTag(data.id);
      if (found) {
        await found.remove();
        return true;
      } else {
        createErrorWarning('Tag not found');
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
        const found = await this.getTag(tag.id);

        if (found?.id) {
          const foundByName = await this.getTagByName(data.name);
          if (foundByName) {
            createErrorWarning('Tag already exists');
            return false;
          }

          await found.update({
            $set: {
              ...data,
            },
          });
          return true;
        } else {
          createErrorWarning('Tag not found');
          return false;
        }
      } catch (e) {
        handleDbError(e);
        return false;
      }
    } else {
      createErrorWarning('Name must be set');
      return false;
    }
  },

  getTag: async function (this: TagCollection, id: string): Promise<TagDocument | null> {
    const query = this.findOne({
      selector: {
        id,
      },
    });

    return query
      .exec()
      .then((result: TagDocument) => {
        return result;
      })
      .catch((e) => {
        handleDbError(e);
        return null;
      });
  },

  getTagByName: async function (this: TagCollection, name: string): Promise<TagDocument | null> {
    const query = this.findOne({
      selector: {
        name,
      },
    });

    return query
      .exec()
      .then((result: TagDocument) => {
        return result;
      })
      .catch((e) => {
        handleDbError(e);
        return null;
      });
  },
};
