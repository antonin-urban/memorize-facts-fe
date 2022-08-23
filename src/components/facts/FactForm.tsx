import { Button, Input, ListItem, Text } from '@rneui/themed';
import { Formik, FormikBag } from 'formik';
import { View, StyleSheet, ScrollView } from 'react-native';
import * as yup from 'yup';
import { FactProperties, FactDocument } from '../../db/fact/model';
import { Tag } from '../../db/tag/model';
import { FONT_BIG, FONT_MEDIUM, FONT_SMALL } from '../../styleConstants';

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

function FactForm({ onSubmit, tags, initialValues = defaultInitialValues }: FactFormProps): React.ReactElement {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      onReset={(values, formik) => {
        values.tags = [];
        formik.setValues(values);
      }}
      validationSchema={FactValidationSchema}
      enableReinitialize={true}
    >
      {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setValues }) => (
        <ScrollView style={styles.formView}>
          <Input
            style={styles.input}
            label={<Text style={styles.label}>Name</Text>}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            errorMessage={touched.name && errors.name ? errors.name : undefined}
          />
          <Input
            style={styles.input}
            label={<Text style={styles.label}>Description</Text>}
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            value={values.description}
            errorMessage={touched.description && errors.description ? errors.description : undefined}
          />
          <ScrollView>
            {tags.length ? (
              tags.map((tag: Tag, i) => (
                <View style={styles.listItemView} key={i}>
                  <ListItem.CheckBox
                    title={tag.name}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={values.tags.includes(tag.id)}
                    onPress={() => {
                      console.log('pressed', tag.id);
                      console.log('values.tags', values.tags);
                      if (values.tags.includes(tag.id)) {
                        values.tags.splice(values.tags.indexOf(tag.id), 1);
                      } else {
                        values.tags.push(tag.id);
                      }
                      setValues(values);
                    }}
                  ></ListItem.CheckBox>
                </View>
              ))
            ) : (
              <View style={styles.noContent}>
                <Text style={styles.noContentText}>No facts found.</Text>
              </View>
            )}
          </ScrollView>
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
  formView: {
    marginBottom: 30,
  },
  submitButton: {},
  label: {
    fontSize: FONT_BIG,
    fontWeight: '500',
  },
  input: {
    fontSize: FONT_MEDIUM,
  },

  listItemView: {
    paddingTop: 5,
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
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
