import type { FileChooser as PWFileChooser } from 'playwright-core';
import type { ElementHandle as ElementHandleType, FileChooser as FileChooserType } from '../types';

export class FileChooser implements FileChooserType {
  constructor(private _fileChooser: PWFileChooser) {}

  setFiles(
    files:
      | string
      | string[]
      | { name: string; mimeType: string; buffer: Buffer }
      | { name: string; mimeType: string; buffer: Buffer }[],
    options?: { timeout?: number | undefined } | undefined
  ): Promise<void> {
    return this._fileChooser.setFiles(files, options);
  }

  async isMultiple(): Promise<boolean> {
    return this._fileChooser.isMultiple();
  }
}
