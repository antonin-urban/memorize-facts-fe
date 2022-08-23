import { Icon, ListItem } from '@rneui/base';
import { Overlay, Button, Text } from '@rneui/themed';
import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { AppContext } from '../components/AppContext';
import FactForm from '../components/facts/FactForm';
import { FactDocument, Fact } from '../db/fact/model';
import { createDeleteAlert } from '../db/helpers';
import { FONT_MEDIUM, FONT_SMALL } from '../styleConstants';

function FactsScreen(): React.ReactElement {
  const { db } = useContext(AppContext);
  //const [name, setName] = useState('');
  const [facts, setFacts] = useState([]);
  const [tags, setTags] = useState([]);
  const [editVisible, setEditVisible] = useState(false);
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

  const addFact = async (fact: Omit<Fact, 'id'>): Promise<boolean> => {
    return await db.facts.insertFact(fact);
  };

  const removeFact = async (fact: Fact): Promise<boolean> => {
    return db.facts.deleteFact(fact);
  };

  const editFact = async (fact: Fact, data: Omit<Fact, 'id'>): Promise<boolean> => {
    return db.facts.updateFact(fact, data);
  };

  const toggleEditOverlay = (fact?: FactDocument) => {
    console.debug('toggle edit', fact);
    if (fact) {
      setEditedObject(fact);
    }
    setEditVisible(!editVisible);
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
          width: '80%',
          height: '30%',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        fullScreen={false}
        isVisible={editVisible}
        onBackdropPress={toggleEditOverlay}
      >
        <View>
          <FactForm
            onSubmit={async (factFormProps) => {
              const isWithoutError = await editFact(editedObject, { ...trimValues(factFormProps), ...factFormProps });
              if (isWithoutError) {
                toggleEditOverlay();
              }
            }}
            initialValues={{
              name: editedObject.name,
              description: editedObject.description,
              tags: editedObject.tags,
            }}
            tags={tags}
          />
        </View>
      </Overlay>
      <View>
        <FactForm
          onSubmit={async (factFormProps, formikBag) => {
            const isWithoutError = await addFact({
              ...trimValues(factFormProps),
              ...factFormProps,
            });
            if (isWithoutError) {
              formikBag.resetForm();
            }
          }}
          tags={tags}
        />
      </View>
      <ScrollView>
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
                onLongPress={async () => {
                  toggleEditOverlay(item);
                }}
              >
                <View style={styles.listItemView}>
                  <Icon name="label" style={styles.listItemIcon} size={25} />
                  <ListItem.Content style={styles.listItemContent}>
                    <ListItem.Title style={styles.listItemTitle}>{item.name}</ListItem.Title>
                  </ListItem.Content>
                </View>
              </ListItem.Swipeable>
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
    paddingTop: 40,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

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
  },

  noContentText: {
    fontSize: FONT_SMALL,
  },
});

export default FactsScreen;
