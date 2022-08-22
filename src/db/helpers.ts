import { Alert } from 'react-native';
import { RxError } from 'rxdb';

enum ERROR_CODES {
  'DUPLICATE_KEY' = 'COL19',
}

enum ERROR_MESSAGES {
  'COL19' = 'Record already exists',
  'UNKNOWN' = 'Unknown error',
}

export default function handleDbError(e: RxError): void {
  if (e.code) {
    console.error(e.code);
    switch (e.code) {
      case ERROR_CODES.DUPLICATE_KEY:
        createDbErrorWarning(ERROR_MESSAGES[ERROR_CODES.DUPLICATE_KEY]);
        break;
      default:
        console.error(e);
        createDbErrorWarning(ERROR_MESSAGES.UNKNOWN);
        break;
    }
    return;
  }
  console.error(e);
  createDbErrorWarning(ERROR_MESSAGES.UNKNOWN);
}

export function createDbErrorWarning(message: string): void {
  Alert.alert('Error', message, [{ text: 'OK' }]);
}

export async function createDeleteAlert(
  identification: string,
  onPress: (...props) => Promise<unknown>,
): Promise<void> {
  Alert.alert('Delete?', `Are you sure you want to delete ${identification}`, [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'OK',
      onPress: async () => {
        await onPress();
      },
    },
  ]);
}
