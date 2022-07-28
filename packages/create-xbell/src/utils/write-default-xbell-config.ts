import { writeFileSync } from 'fs';
import { join } from 'path';

const tpl = `import type { XBellConfig } from 'xbell';

export default <XBellConfig>({
  viewport: {
    width: 1380,
    height: 720,
  },
  runEnvs: ['prod'],
  browsers: ['chromium'],
  headless: false,
  envConfig: {
    prod: {
      ENV: 'prod',
    }
  },
});

`;
export function writeDefaultXBellConfig(projectDir: string) {
  const configFilepath = join(projectDir, 'xbell.config.ts');
  writeFileSync(configFilepath, tpl, 'utf-8');
}
