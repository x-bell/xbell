import { checkIsProject } from './utils/check-is-project';
import { initExistedProject } from './init-existed-project';
import { initEndToEndProject } from './init-end-to-end-project'

export async function start() {
  const projectDir = process.cwd();
  if (checkIsProject(projectDir)) {
    await initExistedProject()
  } else {
    await initEndToEndProject();
  }
}

start();
