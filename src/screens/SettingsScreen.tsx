import { useMutation } from '@apollo/client';
import { Text } from '@rneui/themed';
import { useContext, useState, useEffect } from 'react';
import { View } from 'react-native';
import { AppContext, AppContextType } from '../components/AppContext';
import SettingsForm, { SettingsValues } from '../components/settings/SettingsForm';
import {
  destroyLoginInSecureStore,
  getLoginFromSecureStore,
  setSyncLoginInSecureStore,
  setSyncStatusInSecureStore,
  SYNC_SECURE_STORE_STATUS,
} from '../db/secureStore';
import { LOGIN_QUERY } from '../graphql/constants';
import { createInfoAlert, createErrorWarning, createCancelAlert } from '../helpers';
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
      await createCancelAlert('Log out', `Are you sure you want to log out from ${email}?`, async () => {
        await destroyLoginInSecureStore();
        await setSyncStatusInSecureStore(SYNC_SECURE_STORE_STATUS.DISABLED);
        context.setSyncStatus(false);
        createInfoAlert('Succed', 'Logged out');
      });
    } catch (e) {
      console.warn(e);
      createErrorWarning('Could not log out');
    }
  } else {
    context.setSyncStatus(false);
    await setSyncStatusInSecureStore(SYNC_SECURE_STORE_STATUS.DISABLED);
  }
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
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <View style={{ flex: 1, flexGrow: 3, flexShrink: 1 }}>
        <SettingsForm
          onSubmit={async (settingsFormProps) => {
            try {
              const response = await loginToGqlServer({
                variables: { email: settingsFormProps.email, password: settingsFormProps.password },
              });

              if (response?.data?.authenticateUserWithPassword) {
                if (
                  response.data.authenticateUserWithPassword?.__typename === 'UserAuthenticationWithPasswordSuccess'
                ) {
                  await setLoginInfoToContext({ ...settingsFormProps, syncOn: true }, context);
                  createInfoAlert('Succes', 'Login successful');
                } else {
                  const errorMessage = response?.data?.authenticateUserWithPassword?.message || 'Unknown error';
                  console.warn(new Error(errorMessage));
                  createErrorWarning(`GQL Server error: ${errorMessage}`);
                }
              } else {
                console.warn(response);
                createErrorWarning(`GQL Server error.`);
              }
            } catch (e) {
              console.warn(e);
              createErrorWarning('Login error');
            }
          }}
          logOut={async () => await logOut(context)}
          initialValues={{
            email: loginInfo[0] || '',
            password: loginInfo[1] || '',
            syncOn: true,
          }}
        />
      </View>
      <View style={{ flex: 1, flexGrow: 2, flexShrink: 1, justifyContent: 'flex-start' }}>
        <Text
          adjustsFontSizeToFit={true}
          style={{
            fontSize: FONT_EXTRA_BIG,
            textAlign: 'center',
            fontWeight: 'bold',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          Sync status: {context.syncStatus ? 'ON' : 'OFF'}
        </Text>
      </View>
    </View>
  );
}

export default SettingsScreen;
