import { Button, Icon, ListItem, Text } from '@rneui/themed';
import { PermissionStatus } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { Notification } from 'expo-notifications';
import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { AppContext } from '../components/AppContext';
import { NotificationDocument } from '../db/notification/model';
import { FONT_MEDIUM, FONT_SMALL } from '../styleConstants';

function HomeScreen(): React.ReactElement {
  const { db } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const [facts, setFacts] = useState([]);
  const [schedules, setSchedules] = useState([]);

  console.log('notifications', notifications);

  useEffect(() => {
    let sub;
    if (db && db.notifications) {
      sub = db.notifications.find().$.subscribe((rxdbNotifications) => {
        setNotifications(rxdbNotifications);
      });
    }
    return () => {
      if (sub && sub.unsubscribe) sub.unsubscribe();
    };
  }, [db]);

  // schedule notifications
  useEffect(() => {
    let sub;
    if (db && db.notifications) {
      sub = db.notifications.find().$.subscribe(async (rxdbNotifications) => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Promise.all(
          rxdbNotifications.map(async (notification: NotificationDocument) => {
            if (notification.idNotification) {
              return;
            }
            console.log('notification', notification);
            const fact = await notification.populateFact();
            const schedule = await notification.populateSchedule();

            console.log('fact', fact);
            console.log('schedule', schedule);

            console.warn('schedule', schedule.interval);

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
            const notificationId = await Notifications.scheduleNotificationAsync(schedulingOptions);
            console.log(notificationId);
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

  useEffect(() => {
    let sub;
    if (db && db.facts) {
      sub = db.facts
        .find()
        .sort({ name: 'asc' })
        .$.subscribe((rxdbFacts) => {
          setFacts(rxdbFacts);
        });
    }
    return () => {
      if (sub && sub.unsubscribe) sub.unsubscribe();
    };
  }, [db]);

  useEffect(() => {
    let sub;
    if (db && db.schedules) {
      sub = db.schedules
        .find()
        .sort({ name: 'asc' })
        .$.subscribe((rxdbTags) => {
          setSchedules(rxdbTags);
        });
    }
    return () => {
      if (sub && sub.unsubscribe) sub.unsubscribe();
    };
  }, [db]);

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
        {notifications.length ? (
          notifications.map((item: NotificationDocument, i) => (
            <View style={styles.listItemView} key={i}>
              <ListItem>
                <View style={styles.listItemView}>
                  <Icon name="notes" style={styles.listItemIcon} size={25} />
                  <ListItem.Content style={styles.listItemContent}>
                    <ListItem.Title style={styles.listItemTitle}>
                      {schedules.length ? (
                        schedules
                          .filter((schedule) => item.schedule === schedule.id)
                          .map((schedule, i) => {
                            return (
                              <Text
                                key={i}
                                style={{
                                  paddingLeft: 2,
                                }}
                              >
                                {`${schedule.name}\r with id ${item.id} \r with notificationId ${item.idNotification}`}
                              </Text>
                            );
                          })
                      ) : (
                        <Text>error</Text>
                      )}
                    </ListItem.Title>
                    <ListItem.Subtitle>
                      {facts.length ? (
                        facts
                          .filter((fact) => item.fact === fact.id)
                          .map((fact, i) => {
                            return (
                              <View key={i} style={styles.listItemScheduleSubtitle}>
                                <Icon name="calendar-today" size={FONT_SMALL} />
                                <Text
                                  style={{
                                    paddingLeft: 2,
                                  }}
                                >
                                  {fact.name}
                                </Text>
                              </View>
                            );
                          })
                      ) : (
                        <Text>error</Text>
                      )}
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
