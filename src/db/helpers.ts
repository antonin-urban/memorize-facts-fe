import { Alert } from 'react-native';
import { RxError } from 'rxdb';

enum ERROR_CODES {
  'DUPLICATE_KEY' = 'COL19',
}

enum ERROR_MESSAGES {
  'COL19' = 'Record already exists',
  'UNKNOWN' = 'Unknown error',
}

export default function handleDbError(e: RxError, callback?: () => void): void {
  if (e.code) {
    console.log(e.code);
    switch (e.code) {
      case ERROR_CODES.DUPLICATE_KEY:
        createDbErrorWarning(ERROR_MESSAGES[ERROR_CODES.DUPLICATE_KEY], callback);
        break;
      default:
        createDbErrorWarning(ERROR_MESSAGES.UNKNOWN, callback);
        console.debug(e);
        break;
    }
    return;
  }
  console.log(e);
  createDbErrorWarning(ERROR_MESSAGES.UNKNOWN, callback);
}

export function createDbErrorWarning(message: string, callback?: () => void): void {
  Alert.alert('Error', message, [{ text: 'OK', onPress: () => callback ?? {} }]);
}
