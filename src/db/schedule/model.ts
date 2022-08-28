import { RxCollection, RxDocument, RxJsonSchema } from 'rxdb';
import { v4 as uuidv4 } from 'uuid';
import { convertMinutesToStringTime, createErrorWarning } from '../../helpers';
import { handleDbError } from '../helpers';

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

export const ScheduleProperties = {};

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
      maxLength: 100,
    },
    type: {
      type: 'string', // ScheduleType.NOTIFY_EVERY | ScheduleType.NOTIFY_AT
      maxLength: 20,
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
  insertSchedule(this: ScheduleCollection, data: Omit<Schedule, 'id' | 'name'>): Promise<boolean>;
  deleteSchedule(this: ScheduleCollection, data: Schedule): Promise<boolean>;
  updateSchedule(this: ScheduleCollection, schedule: Schedule, data: Omit<Schedule, 'id' | 'name'>): Promise<boolean>;
  getScheduleByName(this: ScheduleCollection, name: string): Promise<ScheduleDocument | null>;
  getSchedule(this: ScheduleCollection, id: string): Promise<ScheduleDocument | null>;
  generateName(data: Omit<Schedule, 'id' | 'name'>): string;
};

export const scheduleCollectionMethods: ScheduleCollectionMethods = {
  insertSchedule: async function (this: ScheduleCollection, data: Omit<Schedule, 'id' | 'name'>) {
    const generateName = this.generateName(data);
    if (!generateName) {
      return;
    }
    try {
      const found = await this.getScheduleByName(generateName);

      if (found?.name) {
        createErrorWarning('Schedule already exists');
        return false;
      }

      await this.insert({
        id: uuidv4(),
        name: generateName,
        ...data,
      });
      return true;
    } catch (e) {
      handleDbError(e);
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
        createErrorWarning('Schedule not found');
        return false;
      }
    } catch (e) {
      handleDbError(e);
      return false;
    }
  },

  updateSchedule: async function (this: ScheduleCollection, schedule: Schedule, data: Omit<Schedule, 'id'>) {
    try {
      const generateName = this.generateName(data);
      if (!generateName) {
        return;
      }
      const foundByName = await this.getScheduleByName(generateName);

      if (foundByName) {
        createErrorWarning('Schedule already exists');
        return false;
      }

      const found = await this.getSchedule(schedule.id);

      if (found?.id) {
        await found.update({
          $set: {
            name: generateName,
            ...data,
          },
        });
        return true;
      } else {
        createErrorWarning('Schedule not found');
        return false;
      }
    } catch (e) {
      handleDbError(e);
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

  generateName(data: Omit<Schedule, 'id' | 'name'>): string {
    let generatedName = '';
    if (!data?.type && !data?.interval && !data?.notifyTimes && !data?.dayOfWeek) {
      createErrorWarning('Missing shedule type');
      return '';
    }

    switch (data.type) {
      case ScheduleType.NOTIFY_EVERY:
        if (data?.interval) {
          generatedName += `repeat after ${convertMinutesToStringTime(data.interval)}`;
        } else {
          createErrorWarning(`Missing interval for ${ScheduleType.NOTIFY_EVERY} schedule`);
        }
        break;
      case ScheduleType.NOTIFY_AT:
        if (data?.dayOfWeek && data?.notifyTimes) {
          generatedName += `${data.notifyTimes.join(', ')} at ${data.dayOfWeek.join(', ')}`;
        } else {
          createErrorWarning(`Missing dayOfWeek or notifyTimes for ${ScheduleType.NOTIFY_AT} schedule`);
        }
        break;
      default:
        createErrorWarning(`Unknown schedule type ${data.type}`);
    }

    return generatedName;
  },
};
