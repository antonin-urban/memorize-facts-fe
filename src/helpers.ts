import { Alert } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
export function createDbErrorWarning(message: string, callback: Function) {
  Alert.alert('Error', message, [{ text: 'OK', onPress: () => callback }]);
}
