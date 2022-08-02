import { readFileSync } from 'fs';

export function getJsonFileSpaces(filename: string) {
  const json = readFileSync(filename, 'utf-8')
  try {
    const spaces = json.split('\n')[1].indexOf('"');
    // only support 2 or 4 spaces
    if ([2, 4].includes(spaces)) {
      return spaces;
    }
    return 2;
  } catch (error) {
    return 2;
  }
}
