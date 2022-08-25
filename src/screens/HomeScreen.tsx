import { Button, Icon, ListItem, Text } from '@rneui/themed';
import { PermissionStatus } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { Notification } from 'expo-notifications';
import React, { useEffect, useState, useContext, useReducer, Reducer } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { AppContext } from '../components/AppContext';
import { Fact, FactDocument } from '../db/fact/model';
import { ScheduleDocument, Schedule } from '../db/schedule/model';
import { convertMinutesToHoursAndMinutes } from '../helpers';
import { FONT_MEDIUM, FONT_SMALL } from '../styleConstants';

type NotificationState = {
  actionType: 'merge' | 'set';
  data: [Fact, Schedule][];
};

function HomeScreen(): React.ReactElement {
  const { db } = useContext(AppContext);
  const [notificationsState, setNotificationState] = useReducer<Reducer<NotificationState, Partial<NotificationState>>>(
    (state, newState) => {
      switch (newState.actionType) {
        case 'merge': //merge new data into existing state
          return {
            ...state,
            ...newState,
            data: [...state.data, ...newState.data],
          };
          break;
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

  // re-schedule notifications
  useEffect(() => {
    let sub;
    if (db && db.facts) {
      sub = db.facts.find().$.subscribe(async (rxdbFacts) => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        setNotificationState({
          actionType: 'set',
          data: [],
        });

        await Promise.all(
          rxdbFacts.map(async (fact: FactDocument) => {
            if (!fact.schedules.length) {
              return;
            }

            const schedules = await fact.populateSchedules();

            schedules.map(async (schedule: ScheduleDocument) => {
              const schedulingOptions = {
                content: {
                  title: fact.name,
                  body: fact.description,
                  sound: true,
                  priority: Notifications.AndroidNotificationPriority.HIGH,
                  color: 'blue',
                },
                trigger: {
                  seconds: schedule.interval * 60,
                  repeats: true,
                },
              };

              await Notifications.scheduleNotificationAsync(schedulingOptions);

              setNotificationState({
                actionType: 'merge',
                data: [[fact, schedule]],
              });
            });
          }),
        );
      });
    }
    return () => {
      if (sub && sub.unsubscribe) sub.unsubscribe();
    };
  }, [db]);

  const [notificationPermissions, setNotificationPermissions] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED,
  );

  const scheduleNotification = (seconds: number) => {
    const schedulingOptions = {
      content: {
        title: 'This is a notification',
        body: 'This is the body',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        color: 'blue',
      },
      trigger: {
        seconds: seconds,
      },
    };
    Notifications.scheduleNotificationAsync(schedulingOptions);
  };

  const handleNotification = (notification: Notification) => {
    const { title } = notification.request.content;
    console.warn(title);
  };

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationPermissions(status);
    return status;
  };

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    if (notificationPermissions !== PermissionStatus.GRANTED) return;
    const listener = Notifications.addNotificationReceivedListener(handleNotification);
    return () => listener.remove();
  }, [notificationPermissions]);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home page </Text>
      <Button onPress={() => scheduleNotification(1)} title="Notify" />

      <ScrollView style={styles.listView}>
        {notificationsState.data.length ? (
          notificationsState.data.map((item: [Fact, Schedule], i) => (
            <View style={styles.listItemView} key={i}>
              <ListItem>
                <View style={styles.listItemView}>
                  <Icon name="notes" style={styles.listItemIcon} size={25} />
                  <ListItem.Content style={styles.listItemContent}>
                    <ListItem.Title style={styles.listItemTitle}>
                      <Text
                        key={i}
                        style={{
                          paddingLeft: 2,
                        }}
                      >
                        {convertMinutesToHoursAndMinutes(item[1].interval)}
                      </Text>
                    </ListItem.Title>
                    <ListItem.Subtitle>
                      <View key={i} style={styles.listItemScheduleSubtitle}>
                        <Icon name="calendar-today" size={FONT_SMALL} />
                        <Text
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
            <Text style={styles.noContentText}>No facts found.</Text>
          </View>
        )}
      </ScrollView>
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
});

export default HomeScreen;
