import { Alert } from 'react-native';
export function makeExcerpt(text: string, lenght: number): string {
  let str = text || '';
  if (text.length > lenght) {
    str = str.substring(0, lenght) + '...';
  }
  return str;
}

export function createErrorWarning(message: string): void {
  Alert.alert('Error', message || '', [{ text: 'OK' }]);
}

export function createInfoAlert(title: string, message: string): void {
  Alert.alert(title || 'Warning', message || '', [{ text: 'OK' }]);
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

export async function createCancelAlert(
  title: string,
  message: string,
  onPress: (...props) => Promise<unknown>,
): Promise<void> {
  Alert.alert(title || '', message || '', [
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

export function convertMinutesToStringTime(minutes: number): string {
  const converted = convertMinutesToHoursAndMinutes(minutes);
  return `${converted[0].toString().padStart(2, '0')}:${converted[1].toString().padStart(2, '0')}`;
}

export function convertHoursAndMinutesToMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

export function convertMinutesToHoursAndMinutes(minutes: number): [number, number] {
  return minutes < 0 ? [0, 0] : [Math.floor(minutes / 60), minutes % 60];
}
