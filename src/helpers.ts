export function makeExcerpt(text: string, lenght: number): string {
  let str = text || '';
  if (text.length > lenght) {
    str = str.substring(0, lenght) + '...';
  }
  return str;
}
