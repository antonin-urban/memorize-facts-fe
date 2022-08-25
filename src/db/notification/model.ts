import * as Notifications from 'expo-notifications';
import { RxCollection, RxDocument, RxJsonSchema } from 'rxdb';
import { v4 as uuidv4 } from 'uuid';
import { Fact } from '../fact/model';
import { createDbErrorWarning, handleDbError } from '../helpers';
import { Schedule } from '../schedule/model';

export type Notification = {
  id: string;
  fact: string;
  schedule: string;
  idNotification?: string;
};

export const notificationSchema: RxJsonSchema<Notification> = {
  title: 'notification schema',
  description: 'notifications used to categorize facts',
  version: 0,
  keyCompression: true,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    idNotification: {
      type: 'string',
      maxLength: 100,
    },
    fact: {
      type: 'string',
      maxLength: 100,
    },
    schedule: {
      type: 'string',
      maxLength: 100,
    },
  },
  required: ['fact', 'schedule'],
  indexes: ['fact', 'schedule'],
};

export type NotificationCollection = RxCollection<Notification, undefined, NotificationCollectionMethods>;
export type NotificationDocument = RxDocument<Notification>;

// we declare one static ORM-method for the collection
type NotificationCollectionMethods = {
  insertNotification(this: NotificationCollection, data: Omit<Notification, 'id'>): Promise<boolean>;
  deleteNotification(this: NotificationCollection, data: Notification): Promise<boolean>;
  deleteNotificationsByFact(this: NotificationCollection, factId: string): Promise<boolean>;
  deleteNotificationsBySchedule(this: NotificationCollection, scheduleId: string): Promise<boolean>;
  updateNotificationId(
    this: NotificationCollection,
    notification: Notification,
    notificationId: string,
  ): Promise<boolean>;
  getNotificationByFactAndSchedule(
    this: NotificationCollection,
    factId: string,
    scheduleId: string,
  ): Promise<NotificationDocument | null>;
  getNotificationsByFact(this: NotificationCollection, factId: string): Promise<NotificationDocument[] | null>;
  getNotificationsBySchedule(this: NotificationCollection, scheduleId: string): Promise<NotificationDocument[] | null>;
  getNotification(this: NotificationCollection, id: string): Promise<NotificationDocument | null>;
};

export const notificationCollectionMethods: NotificationCollectionMethods = {
  insertNotification: async function (this: NotificationCollection, data: Omit<Notification, 'id'>) {
    try {
      const found = await this.getNotificationByFactAndSchedule(data.fact, data.schedule);

      if (found?.id) {
        console.error('Notification already exists');
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
  },

  deleteNotification: async function (this: NotificationCollection, data: Notification) {
    try {
      const found = await this.getNotification(data.id);
      if (found) {
        if (found.idNotification) {
          try {
            console.log('cancel notification schedule');
            await Notifications.cancelScheduledNotificationAsync(found.idNotification);
          } catch (e) {
            createDbErrorWarning('Notfication schedule cancel error');
            return false;
          }
        }
        await found.remove();
        return true;
      } else {
        createDbErrorWarning('Notification not found');
        return false;
      }
    } catch (e) {
      handleDbError(e);
      return false;
    }
  },

  deleteNotificationsByFact: async function (this: NotificationCollection, factId: string) {
    try {
      const found = await this.getNotificationsByFact(factId);
      console.log('found', found.length);
      if (found) {
        const promises = await Promise.all(
          found.map(async (notification): Promise<boolean> => {
            if (notification.idNotification) {
              try {
                console.log('cancel notification schedule');
                await Notifications.cancelScheduledNotificationAsync(notification.idNotification);
              } catch (e) {
                console.error('Notfication schedule cancel error');
                return false;
              }
            }
            await notification.remove();
            return true;
          }),
        );

        return promises.every((result) => result === true);
      } else {
        createDbErrorWarning('Notification not found');
        return false;
      }
    } catch (e) {
      handleDbError(e);
      return false;
    }
  },

  deleteNotificationsBySchedule: async function (this: NotificationCollection, scheduleId: string) {
    try {
      const found = await this.getNotificationsBySchedule(scheduleId);
      if (found) {
        const promises = await Promise.all(
          found.map(async (notification): Promise<boolean> => {
            if (notification.idNotification) {
              try {
                console.log('cancel notification schedule');
                await Notifications.cancelScheduledNotificationAsync(notification.idNotification);
              } catch (e) {
                console.error('Notfication schedule cancel error');
                return false;
              }
            }
            await notification.remove();
            return true;
          }),
        );

        return promises.every((result) => result === true);
      } else {
        createDbErrorWarning('Notification not found');
        return false;
      }
    } catch (e) {
      handleDbError(e);
      return false;
    }
  },

  updateNotificationId: async function (
    this: NotificationCollection,
    notification: Notification,
    idNotification: string,
  ) {
    try {
      const found = await this.getNotification(notification.id);

      if (found?.id) {
        const found = await this.getNotificationByFactAndSchedule(notification.fact, notification.schedule);

        if (!found.idNotification) {
          console.error('Notification already has idNotification');
          return false;
        }

        await found.update({
          $set: {
            idNotification: idNotification,
          },
        });
        return true;
      } else {
        createDbErrorWarning('Notification not found');
        return false;
      }
    } catch (e) {
      handleDbError(e);
      return false;
    }
  },

  getNotification: async function (this: NotificationCollection, id: string): Promise<NotificationDocument | null> {
    const query = this.findOne({
      selector: {
        id,
      },
    });

    return query
      .exec()
      .then((result: NotificationDocument) => {
        return result;
      })
      .catch((e) => {
        handleDbError(e);
        return null;
      });
  },

  getNotificationByFactAndSchedule: async function (
    this: NotificationCollection,
    factId: string,
    scheduleId: string,
  ): Promise<NotificationDocument | null> {
    const query = this.findOne({
      selector: {
        fact: factId,
        schedule: scheduleId,
      },
    });

    return query
      .exec()
      .then((result: NotificationDocument[]) => {
        return result;
      })
      .catch((e) => {
        handleDbError(e);
        return null;
      });
  },

  getNotificationsByFact: async function (
    this: NotificationCollection,
    factId: string,
  ): Promise<NotificationDocument[] | null> {
    const query = this.find({
      selector: {
        fact: factId,
      },
    });

    return query
      .exec()
      .then((result: NotificationDocument[]) => {
        return result;
      })
      .catch((e) => {
        handleDbError(e);
        return null;
      });
  },

  getNotificationsBySchedule: async function (
    this: NotificationCollection,
    scheduleId: string,
  ): Promise<NotificationDocument[] | null> {
    const query = this.find({
      selector: {
        schedule: scheduleId,
      },
    });

    return query
      .exec()
      .then((result: NotificationDocument[]) => {
        return result;
      })
      .catch((e) => {
        handleDbError(e);
        return null;
      });
  },
};
