import { Button, Icon, ListItem, Overlay } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { AppContext } from '../components/AppContext';
import TagForm from '../components/tags/TagForm';
import { createDeleteAlert } from '../db/helpers';
import { Tag, TagDocument } from '../db/tag/model';

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

  return (
    <View style={{ paddingTop: 10, flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
      <Overlay
        overlayStyle={{
          width: '80%',
          height: '20%',
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
              console.log('submit');
              console.log(editedObject);
              const isWithoutError = await editTag(editedObject, { ...tagFormProps });
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
            const isWithoutError = await addTag({ ...tagFormProps });
            if (isWithoutError) {
              formikBag.resetForm();
            }
          }}
        />
      </View>
      <View
        style={{
          paddingTop: 10,
        }}
      >
        {tags.map((item: TagDocument, i) => (
          <View key={i} style={{ paddingTop: 10 }}>
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
              onLongPress={() => console.log('long press', item.name)}
            >
              <Icon name="label" />
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem.Swipeable>
          </View>
        ))}
      </View>
    </View>
  );
}

export default TagsScreen;
