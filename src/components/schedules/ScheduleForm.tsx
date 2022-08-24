import { Button, Input, ListItem, Text } from '@rneui/themed';
import { Formik, FormikBag } from 'formik';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';
import { ScheduleProperties, ScheduleDocument, ScheduleType } from '../../db/schedule/model';
import { FONT_BIG, FONT_MEDIUM, FONT_SMALL } from '../../styleConstants';
import FormHeaderWithButtons from '../FormHeaderWithButtons';

interface ScheduleFormValues {
  name: string;
  type: ScheduleType;
  interval?: number;
  notifyTimes?: string[];
  dayOfWeek?: boolean[]; // 0-6
}

interface ScheduleFormProps {
  onSubmit: (values: ScheduleFormValues, formikBag?: FormikBag<ScheduleFormProps, ScheduleFormValues>) => void;
  initialValues?: ScheduleFormValues;
  schedule?: ScheduleDocument;
  isUpdate?: boolean;
  onDelete?: (values: ScheduleFormValues, formikBag?: FormikBag<ScheduleFormProps, ScheduleFormValues>) => void;
  onCancel?: (values: ScheduleFormValues, formikBag?: FormikBag<ScheduleFormProps, ScheduleFormValues>) => void;
}

const ScheduleValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(ScheduleProperties.name.minLength, ({ min }) => `Schedule name must be at least ${min} characters`)
    .max(ScheduleProperties.name.maxLenth, ({ max }) => `Schedule name must be maximum ${max} characters`)
    .required('Schedule name is required'),
});

const defaultInitialValues: ScheduleFormValues = {
  name: '',
  type: ScheduleType.NOTIFY_AT,
  interval: 0, // in minutes, with ScheduleType.NOTIFY_EVERY
  notifyTimes: [], // for ScheduleType.NOTIFY_AT
  dayOfWeek: [false, false, false, false, false, false, false], // for ScheduleType.NOTIFY_AT
};

function ScheduleForm({
  onSubmit,
  initialValues = defaultInitialValues,
  isUpdate = false,
  onDelete,
  onCancel,
}: ScheduleFormProps): React.ReactElement {
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

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
          validationSchema={ScheduleValidationSchema}
          enableReinitialize={true}
        >
          {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, touched, errors }) => (
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
                <View style={styles.listItemCheckBoxView}>
                  <ListItem.CheckBox
                    key={ScheduleType.NOTIFY_AT}
                    containerStyle={styles.listItemCheckBox}
                    textStyle={styles.listItemCheckBoxText}
                    title={'Notify at'}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={values.type === ScheduleType.NOTIFY_AT.toString()}
                    onPress={() => {
                      setFieldValue('type', ScheduleType.NOTIFY_AT);
                    }}
                  ></ListItem.CheckBox>
                  <ListItem.CheckBox
                    key={ScheduleType.NOTIFY_EVERY}
                    containerStyle={styles.listItemCheckBox}
                    textStyle={styles.listItemCheckBoxText}
                    title={'Notify every'}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={values.type === ScheduleType.NOTIFY_EVERY.toString()}
                    onPress={() => {
                      setFieldValue('type', ScheduleType.NOTIFY_EVERY);
                    }}
                  ></ListItem.CheckBox>
                </View>
                {values.type === ScheduleType.NOTIFY_EVERY.toString() ? (
                  <SafeAreaView style={styles.timePickerSafeArea}>
                    <View style={styles.timePickerView}>
                      <Text style={styles.timePickerLabel}>Interval</Text>
                      <Text style={styles.timePickerValue}>
                        {values.interval
                          ? new Date(values.interval / 1000).toLocaleTimeString('it-IT', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'No date selected'}
                      </Text>
                      <Button style={styles.timePickerButton} title="Select interval" onPress={showTimePicker} />
                      <DateTimePickerModal
                        testID="dateTimePicker"
                        date={values.interval ? new Date(values.interval / 1000) : new Date(0)}
                        mode="time"
                        themeVariant="light"
                        is24Hour={true}
                        onConfirm={(selectedDate) => {
                          console.log('selectedDateValue', selectedDate);
                          setFieldValue('interval', selectedDate.getTime() * 1000);
                          console.log('values.interval', values.interval);
                          hideTimePicker();
                        }}
                        isVisible={timePickerVisible}
                        onCancel={() => {
                          hideTimePicker();
                        }}
                        locale="it-IT"
                      />
                    </View>
                  </SafeAreaView>
                ) : (
                  <View></View>
                )}
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

  timePickerSafeArea: {
    flex: 1,
  },

  timePickerView: {
    padding: 20,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  timePickerLabel: {
    fontSize: FONT_BIG,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
  },

  timePickerButton: {},
  timePickerValue: {},

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
  },

  input: {
    fontSize: FONT_MEDIUM,
    flex: 1,
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

export default ScheduleForm;
