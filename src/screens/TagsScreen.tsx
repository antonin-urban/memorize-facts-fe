import AntIcons from '@expo/vector-icons/AntDesign';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { AppContext } from '../components/AppContext';
import { createDbErrorWarning } from '../helpers';

function TagsScreen(): React.ReactElement {
  const { db } = useContext(AppContext);
  const [name, setName] = useState('');
  const [tags, setTags] = useState([]);

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

  const addTag = async () => {
    console.log('addTag: ' + name);

    try {
      await db.tags.insert({
        name: name,
      });
    } catch (e) {
      console.log(e);
      if (e.code === 'COL19') {
        createDbErrorWarning('Tag already exists', () => setName(''));
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Tags page </Text>
      <View>
        <TextInput
          value={name}
          onChangeText={(name) => setName(name)}
          placeholder="Type to add a tag..."
          onSubmitEditing={async () => {
            await addTag();
            setName('');
          }}
        />
        {name.length > 1 && (
          <TouchableOpacity onPress={addTag}>
            <AntIcons name="pluscircleo" />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView>
        {tags.length === 0 && <Text>No tags to display ...</Text>}
        {tags.map((tag, index) => (
          <View key={index}>
            <Text>{tag.get('name')}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default TagsScreen;
