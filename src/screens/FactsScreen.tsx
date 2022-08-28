import { Overlay, Button, Text, Icon, ListItem } from '@rneui/themed';
import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { AppContext } from '../components/AppContext';
import FactForm from '../components/facts/FactForm';
import { FactDocument, Fact } from '../db/fact/model';
import { makeExcerpt, createDeleteAlert } from '../helpers';
import { FONT_MEDIUM, FONT_SMALL } from '../styleConstants';

function FactsScreen(): React.ReactElement {
  const { db } = useContext(AppContext);
  const [facts, setFacts] = useState([]);
  const [tags, setTags] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editedObject, setEditedObject] = useState({
    name: '',
  } as FactDocument);

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
    if (db && db.tags) {
      sub = db.tags
        .find()
        .sort({ name: 'asc' })
        .$.subscribe((rxdbTags) => {
          setTags(rxdbTags);
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

  const addFact = async (fact: Omit<Fact, 'id'>): Promise<boolean> => {
    const inserted = await db.facts.insertFact(fact);
    return inserted ? true : false;
  };

  const removeFact = async (fact: Fact): Promise<boolean> => {
    return db.facts.deleteFact(fact);
  };

  const editFact = async (fact: Fact, data: Omit<Fact, 'id'>): Promise<boolean> => {
    return db.facts.updateFact(fact, data);
  };

  const toggleEditOverlay = (fact?: FactDocument) => {
    if (fact) {
      setEditedObject(fact);
    }
    setEditVisible(!editVisible);
  };

  const toggleAddOverlay = () => {
    setAddVisible(!addVisible);
  };

  const trimValues = (data: Partial<Fact>): Partial<Omit<Fact, 'id'>> => {
    return {
      name: data.name.trim(),
      description: data.description.trim(),
    };
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
          <FactForm
            onSubmit={async (factFormProps) => {
              const isWithoutError = await editFact(editedObject, { ...trimValues(factFormProps), ...factFormProps });
              if (isWithoutError) {
                toggleEditOverlay();
              }
            }}
            onCancel={() => toggleEditOverlay()}
            onDelete={async () => {
              await createDeleteAlert(editedObject.name, async () => {
                removeFact(editedObject);
                toggleEditOverlay();
              });
            }}
            initialValues={{
              name: editedObject.name,
              description: editedObject.description,
              tags: editedObject.tags,
              schedules: editedObject.schedules,
            }}
            tags={tags}
            schedules={schedules}
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
          <FactForm
            onSubmit={async (factFormProps, formikBag) => {
              const isWithoutError = await addFact({
                ...trimValues(factFormProps),
                ...factFormProps,
              });
              if (isWithoutError) {
                formikBag.resetForm();
                toggleAddOverlay();
              }
            }}
            onCancel={toggleAddOverlay}
            tags={tags}
            schedules={schedules}
          />
        </View>
      </Overlay>

      <Button onPress={toggleAddOverlay} title="Add new fact" />
      <ScrollView style={styles.listView}>
        {facts.length ? (
          facts.map((item: FactDocument, i) => (
            <View style={styles.listItemView} key={i}>
              <ListItem.Swipeable
                rightContent={(reset) => (
                  <Button
                    title="Delete"
                    onPress={async () => {
                      createDeleteAlert(item.name, () => removeFact(item));
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
                  <Icon name="notes" style={styles.listItemIcon} size={25} />
                  <ListItem.Content style={styles.listItemContent}>
                    <ListItem.Title style={styles.listItemTitle}>{item.name}</ListItem.Title>
                    <ListItem.Subtitle style={styles.listItemSubtitle}>
                      {item.description ? makeExcerpt(item.description, 50) : 'No description'}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.listItemTagSubtitle}>
                      {tags.length ? (
                        tags
                          .filter((tag) => item.tags.includes(tag.id))
                          .map((tag, i) => {
                            return (
                              <View key={i} style={styles.listItemSubtitleTag}>
                                <Icon name="tag" size={FONT_SMALL} />
                                <Text adjustsFontSizeToFit={true}> {tag.name}</Text>
                              </View>
                            );
                          })
                      ) : (
                        <Text adjustsFontSizeToFit={true}>No tags</Text>
                      )}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.listItemScheduleSubtitle}>
                      {schedules.length ? (
                        schedules
                          .filter((schedule) => item.schedules.includes(schedule.id))
                          .map((schedule, i) => {
                            return (
                              <View key={i} style={styles.listItemSubtitleTag}>
                                <Icon name="calendar-today" size={FONT_SMALL} />
                                <Text
                                  adjustsFontSizeToFit={true}
                                  style={{
                                    paddingLeft: 2,
                                  }}
                                >
                                  {schedule.name}
                                </Text>
                              </View>
                            );
                          })
                      ) : (
                        <Text adjustsFontSizeToFit={true}>No schedules</Text>
                      )}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </View>
              </ListItem.Swipeable>
            </View>
          ))
        ) : (
          <View style={styles.noContent}>
            <Text adjustsFontSizeToFit={true} style={styles.noContentText}>
              No facts found.
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
  },

  listItemContent: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

  listItemIcon: { paddingRight: 15 },

  listItemTitle: { paddingRight: 15, fontSize: FONT_MEDIUM, fontWeight: 'bold' },

  listItemSubtitle: { paddingRight: 15, paddingTop: 5, fontSize: FONT_MEDIUM },

  listItemTagSubtitle: { paddingRight: 15, paddingTop: 0, marginTop: 20, marginBottom: 0 },

  listItemScheduleSubtitle: {
    marginTop: 10,
  },

  listItemSubtitleTag: {
    paddingRight: 10,
    marginTop: 0,
    paddingBottom: 5,
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: FONT_SMALL,
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

export default FactsScreen;
