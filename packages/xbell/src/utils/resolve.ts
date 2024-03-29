import * as path from 'node:path';

export function resolvePath(modulePath: string, importer?: string) {

  if (!modulePath) return null;

  if (modulePath.startsWith('.') && importer) {
    return path.resolve(
      path.dirname(importer),
      modulePath
    );
  }

  return modulePath;
}
