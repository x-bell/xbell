import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const tpl = `import type { XBellConfig } from 'xbell';

const config: XBellConfig = {
  browser: {
    viewport: {
      width: 1380,
      height: 720,
    },
    headless: true,
  },
};

export default config;

`;

const XBellConfigFilePaths = [
  'xbell.config.ts',
  'xbell.config.js',
  'xbell.config.mjs',
  'xbell.config.cjs',
];
export function writeDefaultXBellConfig(projectDir: string) {
  const isExisted = XBellConfigFilePaths.some(filename => existsSync(join(projectDir, filename)))
  if (!isExisted) {
    const configFilepath = join(projectDir, 'xbell.config.ts');
    writeFileSync(configFilepath, tpl, 'utf-8');
  }
}
