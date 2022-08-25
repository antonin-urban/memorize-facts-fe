export function makeExcerpt(text: string, lenght: number): string {
  let str = text || '';
  if (text.length > lenght) {
    str = str.substring(0, lenght) + '...';
  }
  return str;
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
