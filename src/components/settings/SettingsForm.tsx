import { Button, Text, Input } from '@rneui/themed';
import { Formik, FormikBag } from 'formik';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as yup from 'yup';
import { FONT_BIG, FONT_MEDIUM } from '../../styleConstants';

export interface SettingsValues {
  email: string;
  password: string;
  syncOn: boolean;
}

export interface FactFormProps {
  onSubmit: (values: SettingsValues, formikBag?: FormikBag<FactFormProps, SettingsValues>) => void;
  logOut: () => Promise<void>;
  initialValues?: SettingsValues;
}

const SettingsValidationSchema = yup.object().shape({
  email: yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: yup
    .string()
    .max(255)
    .min(8, 'Your password is too short. It should be at least 8 characters.')
    .required('Password is required'),
});

const defaultInitialValues: SettingsValues = {
  email: '',
  password: '',
  syncOn: true,
};

function SettingsForm({ onSubmit, logOut, initialValues = defaultInitialValues }: FactFormProps): React.ReactElement {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.formContainerView}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={SettingsValidationSchema}
          enableReinitialize={true}
        >
          {({ handleChange, handleBlur, handleSubmit, resetForm, values, touched, errors }) => (
            <View style={styles.formDataView}>
              <Input
                style={styles.input}
                label={<Text style={styles.label}>Email</Text>}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                errorMessage={touched.email && errors.email ? errors.email : undefined}
                returnKeyType={'next'}
                placeholder="email"
              />
              <Input
                style={styles.input}
                label={<Text style={styles.label}>Password</Text>}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                errorMessage={touched.password && errors.password ? errors.password : undefined}
                returnKeyType={'done'}
                placeholder="password"
                secureTextEntry={true}
              />
              {
                // https://github.com/gimmickless/iyiye-native-app/issues/5
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <Button
                  size="lg"
                  style={styles.submitButton}
                  radius={0}
                  onPress={handleSubmit as any}
                  title="Login and turn on sync"
                />
              }
              {
                <Button
                  size="lg"
                  style={styles.logOutButton}
                  radius={0}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onPress={async () => {
                    resetForm();
                    await logOut();
                  }}
                  title="Log out and turn off sync"
                />
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
    flex: 1,
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

  logOutButton: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 10,
  },

  label: {
    fontSize: FONT_BIG,
    fontWeight: '500',
  },

  input: {
    fontSize: FONT_MEDIUM,
    width: '100%',
  },
});

export default SettingsForm;
