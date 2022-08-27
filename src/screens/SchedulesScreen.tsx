import { ListItem, Icon, Button, Overlay } from '@rneui/themed';
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AppContext } from '../components/AppContext';
import ScheduleForm from '../components/schedules/ScheduleForm';
import { createDeleteAlert } from '../db/helpers';
import { ScheduleDocument, Schedule } from '../db/schedule/model';
import { FONT_MEDIUM, FONT_SMALL } from '../styleConstants';

function SchedulesScreen(): React.ReactElement {
  const { db } = useContext(AppContext);
  const [schedules, setSchedules] = useState([]);
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editedObject, setEditedObject] = useState({
    name: '',
  } as ScheduleDocument);

  useEffect(() => {
    let sub;
    if (db && db.schedules) {
      sub = db.schedules
        .find()
        .sort({ name: 'asc' })
        .$.subscribe((rxdbSchedules) => {
          setSchedules(rxdbSchedules);
        });
    }
    return () => {
      if (sub && sub.unsubscribe) sub.unsubscribe();
    };
  }, [db]);

  const addSchedule = async (schedule: Omit<Schedule, 'id' | 'name'>): Promise<boolean> => {
    return await db.schedules.insertSchedule(schedule);
  };

  const removeSchedule = async (schedule: Schedule): Promise<boolean> => {
    return db.schedules.deleteSchedule(schedule);
  };

  const editSchedule = async (schedule: Schedule, data: Omit<Schedule, 'id' | 'name'>): Promise<boolean> => {
    return db.schedules.updateSchedule(schedule, { ...data });
  };

  const toggleEditOverlay = (schedule?: ScheduleDocument) => {
    if (schedule) {
      setEditedObject(schedule);
    }
    setEditVisible(!editVisible);
  };

  const toggleAddOverlay = () => {
    setAddVisible(!addVisible);
  };

  return (
    <View style={styles.mainView}>
      <Overlay
        overlayStyle={{
          width: '90%',
          height: '70%',
        }}
        isVisible={editVisible}
        onBackdropPress={toggleEditOverlay}
      >
        <View style={styles.overlayView}>
          <ScheduleForm
            onSubmit={async (scheduleFormProps) => {
              const isWithoutError = await editSchedule(editedObject, {
                ...scheduleFormProps,
              });
              if (isWithoutError) {
                toggleEditOverlay();
              }
            }}
            onCancel={() => toggleEditOverlay()}
            onDelete={async () => {
              await createDeleteAlert(editedObject.name, async () => {
                removeSchedule(editedObject);
                toggleEditOverlay();
              });
            }}
            initialValues={{
              type: editedObject.type,
              interval: editedObject.interval,
            }}
            isUpdate={true}
          />
        </View>
      </Overlay>

      <Overlay
        overlayStyle={{
          width: '90%',
          height: '70%',
        }}
        isVisible={addVisible}
        onBackdropPress={toggleAddOverlay}
      >
        <View style={styles.overlayView}>
          <ScheduleForm
            onSubmit={async (scheduleFormProps, formikBag) => {
              const isWithoutError = await addSchedule(scheduleFormProps);
              if (isWithoutError) {
                formikBag.resetForm();
                toggleAddOverlay();
              }
            }}
            onCancel={toggleAddOverlay}
          />
        </View>
      </Overlay>

      <Button onPress={toggleAddOverlay} title="Add new schedule" />
      <ScrollView style={styles.listView}>
        {schedules.length ? (
          schedules.map((item: ScheduleDocument, i) => (
            <View style={styles.listItemView} key={i}>
              <ListItem.Swipeable
                rightContent={(reset) => (
                  <Button
                    title="Delete"
                    onPress={async () => {
                      createDeleteAlert(item.name, () => removeSchedule(item));
                      reset();
                    }}
                    icon={{ name: 'delete', color: 'white' }}
                    buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                  />
                )}
                leftContent={(reset) => (
                  <Button
                    title="Edit"
                    onPress={async () => {
                      toggleEditOverlay(item);
                      reset();
                    }}
                    icon={{ name: 'edit', color: 'white' }}
                    buttonStyle={{ minHeight: '100%' }}
                  />
                )}
                onPress={() => {
                  toggleEditOverlay(item);
                }}
              >
                <View style={styles.listItemView}>
                  <Icon name="calendar-today" style={styles.listItemIcon} size={25} />
                  <ListItem.Content style={styles.listItemContent}>
                    <ListItem.Title style={styles.listItemTitle}>{item.name}</ListItem.Title>
                  </ListItem.Content>
                </View>
              </ListItem.Swipeable>
            </View>
          ))
        ) : (
          <View style={styles.noContent}>
            <Text adjustsFontSizeToFit={true} style={styles.noContentText}>
              No schedules found.
            </Text>
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
    marginBottom: 5,
  },

  listItemContent: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

  listItemIcon: { paddingRight: 15 },

  listItemTitle: { paddingRight: 15, fontSize: FONT_MEDIUM },

  noContent: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },

  noContentText: {
    fontSize: FONT_SMALL,
  },
});

export default SchedulesScreen;
