import { Button, Input, Text } from '@rneui/themed';
import { Formik, FormikBag } from 'formik';
import { View, StyleSheet } from 'react-native';
import * as yup from 'yup';
import { TagProperties } from '../../db/tag/model';
import { FONT_BIG, FONT_MEDIUM } from '../../styleConstants';

interface TagFormValues {
  name: string;
}

interface TagFormProps {
  onSubmit: (values: TagFormValues, formikBag?: FormikBag<TagFormProps, TagFormValues>) => void;
  initialValues?: TagFormValues;
}

const TagValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(TagProperties.name.minLength, ({ min }) => `Tag name must be at least ${min} characters`)
    .max(TagProperties.name.maxLenth, ({ max }) => `Tag name must be maximum ${max} characters`)
    .required('Tag name is required'),
});

const defaultInitialValues: TagFormValues = {
  name: '',
};

function TagForm({ onSubmit, initialValues = defaultInitialValues }: TagFormProps): React.ReactElement {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={TagValidationSchema}>
      {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
        <View style={styles.formView}>
          <Input
            style={styles.input}
            label={<Text style={styles.label}>Tag name</Text>}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            errorMessage={touched.name && errors.name ? errors.name : undefined}
          />
          {
            // https://github.com/gimmickless/iyiye-native-app/issues/5
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Button size="lg" style={styles.submitButton} onPress={handleSubmit as any} title="Submit" />
          }
        </View>
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
});

export default TagForm;
