import { Button, ListItem, Text } from '@rneui/themed';
import { Formik, FormikBag } from 'formik';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { FactDocument } from '../../db/fact/model';
import { Tag } from '../../db/tag/model';
import { FONT_MEDIUM, FONT_SMALL } from '../../styleConstants';

interface FactTagSelectorProps {
  onSubmit: (values: unknown[], formikBag: FormikBag<FactTagSelectorProps, undefined>, addedTags: string[]) => void;
  fact: FactDocument;
  tags: Tag[];
}

function FactTagSelector({ onSubmit, fact, tags }: FactTagSelectorProps): React.ReactElement {
  const [addedTags, setTags] = useState(function (): string[] {
    if (fact?.tags) {
      return tags.flatMap((tag) => {
        if (fact.tags.includes(tag.id)) {
          return tag.id;
        } else {
          return [];
        }
      });
    } else {
      return [];
    }
  });

  const toggleTag = (tag: Tag) => {
    if (addedTags.includes(tag.id)) {
      addedTags.splice(addedTags.indexOf(tag.id), 1);
    } else {
      addedTags.push(tag.id);
    }

    setTags(addedTags);
  };

  const handleSubmit = (values, formikBag, addedTags) => {
    onSubmit(values, formikBag, addedTags);
    setTags([]);
  };

  return (
    <Formik
      onSubmit={(values, formikBag) => {
        handleSubmit(values, formikBag, addedTags);
      }}
      initialValues={[] as Tag[]}
    >
      {({ handleSubmit, setFieldValue }) => (
        <ScrollView>
          {tags.length ? (
            tags.map((tag: Tag, i) => (
              <View style={styles.listItemView} key={i}>
                <ListItem.CheckBox
                  title={tag.name}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={addedTags.includes(tag.id)}
                  onPress={() => {
                    toggleTag(tag);
                    setFieldValue('tags', addedTags);
                  }}
                ></ListItem.CheckBox>
              </View>
            ))
          ) : (
            <View style={styles.noContent}>
              <Text style={styles.noContentText}>No facts found.</Text>
            </View>
          )}
          {
            // https://github.com/gimmickless/iyiye-native-app/issues/5
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Button size="lg" style={styles.submitButton} onPress={handleSubmit as any} title="Submit" />
          }
        </ScrollView>
      )}
    </Formik>
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
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  listItem: { marginLeft: 15, fontSize: FONT_MEDIUM, backgroundColor: 'transparent' },

  formView: {
    marginBottom: 30,
  },
  submitButton: {},
  checkbox: {
    fontSize: FONT_MEDIUM,
  },
  noContent: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  noContentText: {
    fontSize: FONT_SMALL,
  },
  checkBoxContainer: {},
});

export default FactTagSelector;
