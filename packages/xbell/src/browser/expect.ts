// import { expect } from '@xbell/assert';
// import type { ToMatchImageSnapshotOptions } from '@xbell/snapshot';
// import type { Locator, ElementHandle, CommonPage } from '../types';

// expect.extend({
//   toMatchScreenShot(received?:  Locator | ElementHandle | CommonPage, options: ToMatchImageSnapshotOptions | string) {
//     if (typeof received?.screenshot !== 'function') {
//       throw new Error('toMatchScreenshot: The received object is missing the "sreenshot" method');
//     }

//     const validOpts: ToMatchImageSnapshotOptions = typeof options === 'string' ? { name: options } : options;
//     const buffer = await received.screenshot({
//       type: 'png'
//     });
//     // const state = stateManager.getCurrentState();
//     // return matchImageSnapshot({
//     //   buffer,
//     //   options: validOpts,
//     //   projectName: state.projectName,
//     //   filepath: state.filepath,
//     // });
//   }
// })