import { Button, Input, ListItem, Text } from '@rneui/themed';
import { Formik, FormikBag } from 'formik';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import * as yup from 'yup';
import { FactProperties, FactDocument } from '../../db/fact/model';
import { Tag } from '../../db/tag/model';
import { FONT_BIG, FONT_MEDIUM, FONT_SMALL } from '../../styleConstants';
import FormHeaderWithButtons from '../FormHeaderWithButtons';

interface FactFormValues {
  name: string;
  description: string;
  deadline?: Date;
  active?: boolean;
  tags: string[];
}

interface FactFormProps {
  onSubmit: (values: FactFormValues, formikBag?: FormikBag<FactFormProps, FactFormValues>) => void;
  initialValues?: FactFormValues;
  tags: Tag[];
  fact?: FactDocument;
  isUpdate?: boolean;
  onDelete?: (values: FactFormValues, formikBag?: FormikBag<FactFormProps, FactFormValues>) => void;
  onCancel?: (values: FactFormValues, formikBag?: FormikBag<FactFormProps, FactFormValues>) => void;
}

const FactValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(FactProperties.name.minLength, ({ min }) => `Fact name must be at least ${min} characters`)
    .max(FactProperties.name.maxLenth, ({ max }) => `Fact name must be maximum ${max} characters`)
    .required('Fact name is required'),
});

const defaultInitialValues: FactFormValues = {
  name: '',
  description: '',
  deadline: new Date(Date.now()),
  active: true,
  tags: [],
};

function FactForm({
  onSubmit,
  tags,
  initialValues = defaultInitialValues,
  isUpdate = false,
  onDelete,
  onCancel,
}: FactFormProps): React.ReactElement {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainerView}>
        {isUpdate ? (
          <FormHeaderWithButtons title="Update" onDelete={onDelete} onCancel={onCancel} />
        ) : (
          <FormHeaderWithButtons title="Create new" onCancel={onCancel} />
        )}
      </View>
      <View style={styles.formContainerView}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={FactValidationSchema}
          enableReinitialize={true}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setFieldValue }) => (
            <View style={styles.formDataView}>
              <ScrollView>
                <Input
                  style={styles.input}
                  label={<Text style={styles.label}>Name</Text>}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  errorMessage={touched.name && errors.name ? errors.name : undefined}
                  returnKeyType={'done'}
                />
                <Input
                  style={styles.input}
                  multiline
                  numberOfLines={4}
                  label={<Text style={styles.label}>Description</Text>}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                  errorMessage={touched.description && errors.description ? errors.description : undefined}
                  returnKeyType={'next'}
                />
                <Text style={styles.listItemViewLabel}>Tags</Text>
                <ScrollView horizontal={true}>
                  <View style={styles.listItemCheckBoxView}>
                    {tags.length ? (
                      tags.map((tag: Tag, i) => (
                        <ListItem.CheckBox
                          key={i}
                          containerStyle={styles.listItemCheckBox}
                          textStyle={styles.listItemCheckBoxText}
                          title={tag.name}
                          checkedIcon="dot-circle-o"
                          uncheckedIcon="circle-o"
                          checked={values.tags.includes(tag.id)}
                          onPress={() => {
                            if (values.tags.includes(tag.id)) {
                              setFieldValue(
                                'tags',
                                values.tags.filter((id) => id !== tag.id),
                              );
                            } else {
                              setFieldValue('tags', [...values.tags, tag.id]);
                            }
                          }}
                        ></ListItem.CheckBox>
                      ))
                    ) : (
                      <View style={styles.noContent}>
                        <Text style={styles.noContentText}>No facts found.</Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </ScrollView>
              {
                // https://github.com/gimmickless/iyiye-native-app/issues/5
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <Button size="lg" style={styles.submitButton} radius={0} onPress={handleSubmit as any} title="Submit" />
              }
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainerView: {
    paddingTop: 20,
    flex: 9,
  },

  headerContainerView: {
    flex: 1,
  },

  formDataView: {
    flex: 1,
  },

  submitButton: {
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  label: {
    fontSize: FONT_BIG,
    fontWeight: '500',
  },

  listItemViewLabel: {
    fontSize: FONT_BIG,
    fontWeight: '500',
    flexDirection: 'column',
    paddingLeft: 10,
  },

  input: {
    fontSize: FONT_MEDIUM,
  },

  listItemCheckBoxView: {
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
  },

  listItemCheckBox: {
    backgroundColor: 'transparent',
    paddingTop: 10,
    paddingBottom: 10,
  },

  listItemCheckBoxText: {
    fontSize: FONT_MEDIUM,
    fontWeight: '500',
    paddingLeft: 0,
    marginLeft: 5,
    paddingRight: 10,
  },

  noContent: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  noContentText: {
    fontSize: FONT_SMALL,
  },
});

export default FactForm;
