import { RxCollection, RxDocument, RxJsonSchema } from 'rxdb';
import { v4 as uuidv4 } from 'uuid';
import { createDbErrorWarning, handleDbError } from '../helpers';

export type Schedule = {
  id: string;
  name: string;
  type: ScheduleType;
  interval?: number; // in minutes
  notifyTimes?: string[]; // HH:MM
  dayOfWeek?: boolean[]; // 7 (0 is Monday, 6 is Sunday; true is include, false is exclude)
};

export enum ScheduleType {
  NOTIFY_EVERY = 'NOTIFY_EVERY',
  NOTIFY_AT = 'NOTIFY_AT',
}

export const ScheduleProperties = {
  name: {
    minLength: 3,
    maxLenth: 50,
  },
};

export const scheduleSchema: RxJsonSchema<Schedule> = {
  title: 'schedule schema',
  description: 'Schedule to notify about facts',
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
      maxLength: ScheduleProperties.name.maxLenth,
    },
    type: {
      type: 'string', // ScheduleType.NOTIFY_EVERY | ScheduleType.NOTIFY_AT
      maxLength: 50,
    },
    interval: {
      type: 'number',
    },
    notifyTimes: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
      },
    },
    dayOfWeek: {
      type: 'array',
      maxItems: 7,
      uniqueItems: false,
      minItems: 7,
      items: {
        type: 'boolean',
      },
    },
  },
  required: ['name', 'type'],
  indexes: ['name', 'type'],
};

export type ScheduleCollection = RxCollection<Schedule, undefined, ScheduleCollectionMethods>;
export type ScheduleDocument = RxDocument<Schedule>;

type ScheduleCollectionMethods = {
  insertSchedule(this: ScheduleCollection, data: Omit<Schedule, 'id'>): Promise<boolean>;
  deleteSchedule(this: ScheduleCollection, data: Schedule): Promise<boolean>;
  updateSchedule(this: ScheduleCollection, schedule: Schedule, data: Omit<Schedule, 'id'>): Promise<boolean>;
  getScheduleByName(this: ScheduleCollection, name: string): Promise<ScheduleDocument | null>;
  getSchedule(this: ScheduleCollection, id: string): Promise<ScheduleDocument | null>;
};

export const scheduleCollectionMethods: ScheduleCollectionMethods = {
  insertSchedule: async function (this: ScheduleCollection, data: Omit<Schedule, 'id'>) {
    console.log(data.name);
    if (data?.name) {
      try {
        const found = await this.getScheduleByName(data.name);

        if (found?.name) {
          createDbErrorWarning('Schedule already exists');
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

  deleteSchedule: async function (this: ScheduleCollection, data: Schedule) {
    try {
      const found = await this.getSchedule(data.id);
      if (found) {
        await found.remove();
        return true;
      } else {
        createDbErrorWarning('Schedule not found');
        return false;
      }
    } catch (e) {
      handleDbError(e);
      return false;
    }
  },

  updateSchedule: async function (this: ScheduleCollection, schedule: Schedule, data: Omit<Schedule, 'id'>) {
    if (schedule?.name) {
      try {
        const found = await this.getSchedule(schedule.id);

        if (found?.id) {
          const foundByName = await this.getScheduleByName(data.name);
          if (foundByName && foundByName.id !== schedule.id) {
            createDbErrorWarning('Schedule already exists');
            return false;
          }

          await found.update({
            $set: {
              ...data,
            },
          });
          return true;
        } else {
          createDbErrorWarning('Schedule not found');
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

  getSchedule: async function (this: ScheduleCollection, id: string): Promise<ScheduleDocument | null> {
    const query = this.findOne({
      selector: {
        id,
      },
    });

    return query
      .exec()
      .then((result: ScheduleDocument) => {
        return result;
      })
      .catch((e) => {
        handleDbError(e);
        return null;
      });
  },

  getScheduleByName: async function (this: ScheduleCollection, name: string): Promise<ScheduleDocument | null> {
    const query = this.findOne({
      selector: {
        name,
      },
    });

    return query
      .exec()
      .then((result: ScheduleDocument) => {
        return result;
      })
      .catch((e) => {
        handleDbError(e);
        return null;
      });
  },
};
