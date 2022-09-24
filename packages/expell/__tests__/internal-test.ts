import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'url';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));
export const test = async (description: string, cb: Function) => {
  try {
    await cb();
  } catch(error: unknown) {
    console.error(`Case Failed: ${description}\n${error instanceof Error ? error.message: ''}`)
  }
}

function writeSnapshot(filename: string, content: string) {
  fs.writeFileSync(filename, [
    'export default `',
    content,
    '`;'
  ].join('\n') + '\n', 'utf-8');
}

export const genSnapshotError = (filename: string) => (name: string, func: Function) => {
  let err;
  try {
    func();
    console.log('func');
  } catch (e) {
    err = e;
  }
  if (!err) {
    throw 'Missing error';
  }
  const snapshotDir = path.join(dirname, '__snapshots__', filename);

  const formatError = [
    '<<name>>\n' + err.name,
    '<<message>>\n' + err.message,
  ].join('\n\n');

  fs.mkdirSync(snapshotDir, {
    mode: 0o777,
    recursive: true,
  });

  const snapshotFilepath = path.join(snapshotDir, `${name}.js.snap`);

  if (fs.existsSync(snapshotFilepath)) {
    const existErrorCode = fs.readFileSync(snapshotFilepath, 'utf-8');
    const existErrorString = existErrorCode.match(/export default `\n([\s\S]*?)\n`;\n/)![1];
    if (formatError !== existErrorString) {
      const newSnapshotFilepath = path.join(snapshotDir, `${name}.js.new.snap`);
      writeSnapshot(newSnapshotFilepath, formatError);
    }
  } else {
    writeSnapshot(snapshotFilepath, formatError)
  }
}
