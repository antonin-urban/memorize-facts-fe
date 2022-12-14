import { Button, Input, Text } from '@rneui/themed';
import { Formik, FormikBag } from 'formik';
import { View, StyleSheet, ScrollView } from 'react-native';
import * as yup from 'yup';
import { TagProperties } from '../../db/tag/model';
import { FONT_BIG, FONT_MEDIUM } from '../../styleConstants';
import FormHeaderWithButtons from '../FormHeaderWithButtons';

interface TagFormValues {
  name: string;
}

interface TagFormProps {
  onSubmit: (values: TagFormValues, formikBag?: FormikBag<TagFormProps, TagFormValues>) => void;
  initialValues?: TagFormValues;
  isUpdate?: boolean;
  onDelete?: (values: TagFormValues, formikBag?: FormikBag<TagFormProps, TagFormValues>) => void;
  onCancel?: (values: TagFormValues, formikBag?: FormikBag<TagFormProps, TagFormValues>) => void;
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

function TagForm({
  onSubmit,
  initialValues = defaultInitialValues,
  isUpdate,
  onDelete,
  onCancel,
}: TagFormProps): React.ReactElement {
  return (
    <View style={{ flex: 1 }}>
      {isUpdate ? (
        <View style={styles.headerContainerView}>
          <FormHeaderWithButtons title="Update" onDelete={onDelete} onCancel={onCancel} />
        </View>
      ) : (
        <View></View>
      )}
      <View style={styles.formContainerView}>
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={TagValidationSchema}>
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
            <View style={styles.formDataView}>
              <ScrollView bounces={false}>
                <Input
                  style={styles.input}
                  label={
                    <Text adjustsFontSizeToFit={true} style={styles.label}>
                      Tag name
                    </Text>
                  }
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  errorMessage={touched.name && errors.name ? errors.name : undefined}
                />
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
  headerContainerView: {
    flex: 1,
    flexShrink: 0.7,
    flexGrow: 1.2,
  },

  formContainerView: {
    paddingTop: 20,
    flex: 1,
    flexGrow: 3,
  },

  formDataView: {
    flex: 1,
  },

  submitButton: {},

  label: {
    fontSize: FONT_BIG,
    fontWeight: '500',
  },
  input: {
    fontSize: FONT_MEDIUM,
    flex: 1,
  },
});

export default TagForm;
