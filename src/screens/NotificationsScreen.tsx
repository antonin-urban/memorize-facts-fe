import { Button, Icon, ListItem, Text } from '@rneui/themed';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState, useContext, useReducer, Reducer } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { AppContext } from '../components/AppContext';
import { Fact, FactDocument } from '../db/fact/model';
import { ScheduleDocument, Schedule } from '../db/schedule/model';
import { createErrorWarning } from '../helpers';
import { FONT_MEDIUM, FONT_SMALL, FONT_BIG } from '../styleConstants';

type NotificationState = {
  actionType: 'merge' | 'set';
  data: [Fact, Schedule][];
};

const schedulingOptions: Notifications.NotificationRequestInput = {
  content: {
    title: 'Notification',
    body: 'This is a body of notification',
    sound: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
    color: 'blue',
  },
  trigger: {
    seconds: 60,
    repeats: true,
  },
};

function NotificationsScreen(): React.ReactElement {
  const { db } = useContext(AppContext);
  const [notificationsState, setNotificationState] = useReducer<Reducer<NotificationState, Partial<NotificationState>>>(
    (state, newState) => {
      const newData = new Map<string, [Fact, Schedule]>(); // for handling duplicates
      switch (newState.actionType) {
        case 'merge': //merge new data into existing state
          state.data.forEach(([fact, schedule]) => {
            newData.set(`${fact.id}${schedule.id}`, [fact, schedule]);
          });
          newState.data.forEach(([fact, schedule]) => {
            newData.set(`${fact.id}${schedule.id}`, [fact, schedule]);
          });

          return {
            ...state,
            ...newState,
            data: [...Array.from(newData.values())],
          };
        case 'set': //set the state to the new state
          return {
            ...state,
            ...newState,
            data: [...newState.data],
          };
        default:
          break;
      }
      return state;
    },
    {
      actionType: 'set',
      data: [],
    },
  );
  const [rerender, setRerender] = useState(false); // for rerendering the notification hook

  // re-schedule notifications subscriptions
  useEffect(() => {
    let subToFacts;
    let subToSchedules;

    const resetAllNotifications = async (): Promise<void> => {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotificationState({
        actionType: 'set',
        data: [],
      });
    };

    checkAndRequestNotificationPermissions();

    if (db && db.facts) {
      //init(db);

      //subscribe to facts
      subToFacts = db.facts.find().$.subscribe(async (rxdbFacts) => {
        await resetAllNotifications();

        if (!(await checkNotificationPermissions())) {
          return false;
        }

        await Promise.all(
          rxdbFacts.map(async (fact: FactDocument) => {
            if (!fact.schedules.length) {
              return;
            }

            const schedules = await fact.populateSchedules();

            Promise.all(
              schedules.map(async (schedule: ScheduleDocument) => {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    ...schedulingOptions.content,
                    title: fact.name,
                    body: fact.description,
                  },
                  trigger: {
                    seconds: schedule.interval * 60,
                    repeats: true,
                  },
                });

                setNotificationState({
                  actionType: 'merge',
                  data: [[fact, schedule]],
                });
              }),
            );
          }),
        );
      });

      //subscribe to schedules
      subToSchedules = db.schedules.find().$.subscribe(async (rxdbSchedules) => {
        await resetAllNotifications();

        if (!(await checkNotificationPermissions())) {
          return false;
        }

        const facts = await db.facts.find().exec();

        await Promise.all(
          rxdbSchedules.map(async (schedule: ScheduleDocument) => {
            const fact = facts.find((fact) => fact.schedules.includes(schedule.id));

            if (fact) {
              await Notifications.scheduleNotificationAsync({
                content: {
                  ...schedulingOptions.content,
                  title: fact.name,
                  body: fact.description,
                },
                trigger: {
                  seconds: schedule.interval * 60,
                  repeats: true,
                },
              });

              setNotificationState({
                actionType: 'merge',
                data: [[fact, schedule]],
              });
            }
          }),
        );
      });
    }
    return () => {
      if (subToFacts && subToFacts.unsubscribe) subToFacts.unsubscribe();
      if (subToSchedules && subToSchedules.unsubscribe) subToSchedules.unsubscribe();
    };
  }, [db, rerender]);

  const [notificationPermissions, setNotificationPermissions] =
    useState<Notifications.NotificationPermissionsStatus>(undefined);

  const requestNotificationPermissions = async (): Promise<Notifications.NotificationPermissionsStatus> => {
    if (!notificationPermissions) {
      const newStatus = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        },
      });

      if (!resolveNotificationPermissionStatus(newStatus)) {
        createErrorWarning('Notifications permission not granted. Please enable notifications in your settings.');
        return newStatus;
      }

      return newStatus;
    }
  };

  const checkAndRequestNotificationPermissions = async (): Promise<boolean> => {
    let allowed = false;
    const status = await requestNotificationPermissions();
    setNotificationPermissions(status);
    if (resolveNotificationPermissionStatus(status)) {
      allowed = true;
    }

    return allowed;
  };

  const checkNotificationPermissions = async (): Promise<boolean> => {
    let allowed = false;
    const status = await Notifications.getPermissionsAsync();
    setNotificationPermissions(status);
    if (resolveNotificationPermissionStatus(status)) {
      allowed = true;
    }

    return allowed;
  };

  const resolveNotificationPermissionStatus = (status: Notifications.NotificationPermissionsStatus): boolean => {
    if (status && (status.granted || status.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL)) {
      return true;
    }
    return false;
  };

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {resolveNotificationPermissionStatus(notificationPermissions) ? (
        <ScrollView style={styles.listView}>
          {notificationsState.data.length ? (
            notificationsState.data.map((item: [Fact, Schedule], i) => (
              <View style={styles.listItemView} key={i}>
                <ListItem>
                  <View style={styles.listItemView}>
                    <Icon name="notifications-none" style={styles.listItemIcon} size={25} />
                    <ListItem.Content style={styles.listItemContent}>
                      <ListItem.Title style={styles.listItemTitle}>
                        <Text
                          adjustsFontSizeToFit={true}
                          key={i}
                          style={{
                            paddingLeft: 2,
                          }}
                        >
                          {item[1].name}
                        </Text>
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        <View key={i} style={styles.listItemScheduleSubtitle}>
                          <Icon name="notes" size={FONT_SMALL} />
                          <Text
                            adjustsFontSizeToFit={true}
                            style={{
                              paddingLeft: 2,
                            }}
                          >
                            {item[0].name}
                          </Text>
                        </View>
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </View>
                </ListItem>
              </View>
            ))
          ) : (
            <View style={styles.noContent}>
              <Text adjustsFontSizeToFit={true} style={styles.noContentText}>
                No notifications.
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.noPermisionsView}>
          <Text adjustsFontSizeToFit={true} style={styles.noPermisionsHeaderText}>
            Notifications permission not granted.
          </Text>
          <Text adjustsFontSizeToFit={true} style={styles.noPermisionsText}>
            Please go to setting and allow notifications for this app. Then click the button bellow to try again.
          </Text>
          <Button
            style={styles.noPermisionsButton}
            size="md"
            onPress={async () => {
              (await checkNotificationPermissions())
                ? setRerender(!rerender)
                : createErrorWarning('Notifications permission not granted.');
            }}
          >
            Check permissions status
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  formView: { flex: 1 },

  listView: { flex: 1 },

  overlayView: { flex: 1 },

  listItemView: {
    paddingTop: 5,
    flexDirection: 'row',
    marginTop: 5,
  },

  listItemContent: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    flex: 1,
  },

  listItemIcon: { paddingRight: 15 },

  listItemTitle: { paddingRight: 15, fontSize: FONT_MEDIUM, flex: 1 },

  listItemSubtitle: { paddingRight: 15, paddingTop: 10, fontSize: FONT_MEDIUM },

  listItemScheduleSubtitle: {
    paddingRight: 10,
    paddingTop: 10,
    marginTop: 0,
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: FONT_SMALL,
    flex: 1,
  },

  noContent: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },

  noContentText: {
    fontSize: FONT_SMALL,
  },

  noPermisionsView: {
    padding: 20,
  },

  noPermisionsText: {
    fontSize: FONT_SMALL,
    textAlign: 'justify',
  },

  noPermisionsHeaderText: {
    fontSize: FONT_BIG,
    textAlign: 'center',
    paddingBottom: 10,
  },

  noPermisionsButton: {
    paddingTop: 20,
  },
});

export default NotificationsScreen;
