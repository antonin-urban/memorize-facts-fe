import { useMutation } from '@apollo/client';
import { Text } from '@rneui/themed';
import { useContext, useState, useEffect } from 'react';
import { View } from 'react-native';
import { AppContext, AppContextType } from '../components/AppContext';
import SettingsForm, { SettingsValues } from '../components/settings/SettingsForm';
import { createErrorWarning, createInfoAlert } from '../db/helpers';
import {
  destroyLoginInSecureStore,
  getLoginFromSecureStore,
  setSyncLoginInSecureStore,
  setSyncStatusInSecureStore,
  SYNC_SECURE_STORE_STATUS,
} from '../db/secureStore';
import { LOGIN_QUERY } from '../graphql/constants';
import { FONT_EXTRA_BIG } from '../styleConstants';

const setLoginInfoToContext = async ({ email, password, syncOn }: SettingsValues, context: AppContextType) => {
  await setSyncLoginInSecureStore(email, password);

  if (syncOn) {
    await setSyncStatusInSecureStore(SYNC_SECURE_STORE_STATUS.ENABLED); // for app reloding
    context.setSyncStatus(true); // for current app state
  } else {
    await setSyncStatusInSecureStore(SYNC_SECURE_STORE_STATUS.DISABLED);
    context.setSyncStatus(false);
  }

  return;
};

const logOut = async (context: AppContextType) => {
  const [email] = await getLoginFromSecureStore();
  if (email) {
    try {
      await destroyLoginInSecureStore();
      await setSyncStatusInSecureStore(SYNC_SECURE_STORE_STATUS.DISABLED);
      context.setSyncStatus(false);
      createInfoAlert('Succed', 'Logged out');
    } catch (e) {
      console.error(e);
      createErrorWarning('Could not log out');
    }
  }
  return;
};

type LoginInfo = [string, string];

function SettingsScreen(): React.ReactElement {
  const [loginInfo, setLoginInfo] = useState(['', ''] as LoginInfo);

  const context = useContext(AppContext);

  useEffect(() => {
    getLoginFromSecureStore().then((login) => {
      setLoginInfo(login);
    });
  }, [context]);

  const [loginToGqlServer] = useMutation(LOGIN_QUERY);

  return (
    <View style={{ flex: 1 }}>
      <SettingsForm
        onSubmit={async (settingsFormProps) => {
          try {
            await loginToGqlServer({
              variables: { email: settingsFormProps.email, password: settingsFormProps.password },
            })
              .then(async (res) => {
                if (res.data.authenticateUserWithPassword.__typename === 'UserAuthenticationWithPasswordSuccess') {
                  await setLoginInfoToContext({ ...settingsFormProps, syncOn: true }, context);
                  createInfoAlert('Succes', 'Login successful');
                } else {
                  const errorMessage = res.data.authenticateUserWithPassword.message;
                  console.error(errorMessage);
                  createErrorWarning(`GQL Server error: ${errorMessage}`);
                }
              })
              .catch((err) => {
                console.error(JSON.stringify(err, null, 2));
                createErrorWarning(`GQL Server error: ${err.message}`);
              });

            return;
          } catch (e) {
            createErrorWarning(`Login error: ${e}`);
          }
        }}
        logOut={async () => await logOut(context)}
        initialValues={{
          email: loginInfo[0] ?? '',
          password: loginInfo[1] ?? '',
          syncOn: context.syncStatus,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: FONT_EXTRA_BIG,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Sync status: {context.syncStatus ? 'ON' : 'OFF'}
        </Text>
      </View>
    </View>
  );
}

export default SettingsScreen;
