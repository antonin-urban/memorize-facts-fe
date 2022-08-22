import { Button, Icon, ListItem, Overlay } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { AppContext } from '../components/AppContext';
import TagForm from '../components/tags/TagForm';
import { createDeleteAlert } from '../db/helpers';
import { Tag, TagDocument } from '../db/tag/model';
import { FONT_SMALL, FONT_MEDIUM } from '../styleConstants';

function TagsScreen(): React.ReactElement {
  const { db } = useContext(AppContext);
  //const [name, setName] = useState('');
  const [tags, setTags] = useState([]);
  const [editVisible, setEditVisible] = useState(false);
  const [editedObject, setEditedObject] = useState({
    name: '',
  } as TagDocument);

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

  const addTag = async (tag: Omit<Tag, 'id'>): Promise<boolean> => {
    return await db.tags.insertTag(tag);
  };

  const removeTag = async (tag: Tag): Promise<boolean> => {
    return db.tags.deleteTag(tag);
  };

  const editTag = async (tag: Tag, data: Omit<Tag, 'id'>): Promise<boolean> => {
    return db.tags.updateTag(tag, data);
  };

  const toggleEditOverlay = (tag?: TagDocument) => {
    console.debug('toggle edit', tag);
    if (tag) {
      setEditedObject(tag);
    }
    setEditVisible(!editVisible);
  };

  const trimValues = (data: Partial<Tag>): Omit<Tag, 'id'> => {
    return {
      name: data.name.trim(),
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
          <TagForm
            onSubmit={async (tagFormProps) => {
              const isWithoutError = await editTag(editedObject, { ...trimValues(tagFormProps) });
              if (isWithoutError) {
                toggleEditOverlay();
              }
            }}
            initialValues={{
              name: editedObject.name,
            }}
          />
        </View>
      </Overlay>
      <View>
        <TagForm
          onSubmit={async (tagFormProps, formikBag) => {
            const isWithoutError = await addTag({ ...trimValues(tagFormProps) });
            if (isWithoutError) {
              formikBag.resetForm();
            }
          }}
        />
      </View>
      <ScrollView>
        {tags.length ? (
          tags.map((item: TagDocument, i) => (
            <View style={styles.listItemView} key={i}>
              <ListItem.Swipeable
                rightContent={(reset) => (
                  <Button
                    title="Delete"
                    onPress={async () => {
                      createDeleteAlert(item.name, () => removeTag(item));
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
            <Text style={styles.noContentText}>No tags found.</Text>
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

export default TagsScreen;
