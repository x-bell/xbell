import type { Keyboard as KeyboardInterface, KeyInput } from '../types/keyboard';
import type { Keyboard as PWKeyboard } from 'playwright-core';

export class Keyboard implements KeyboardInterface {
  constructor(protected _keyboard: PWKeyboard) {
  }

  up(keyInput: KeyInput): Promise<void> {
    return this._keyboard.up(keyInput);
  }

  down(keyInput: KeyInput): Promise<void> {
    return this._keyboard.down(keyInput);
  }

  press(keyInput: KeyInput, options?: { delay?: number | undefined; } | undefined): Promise<void> {
    return this._keyboard.press(keyInput)
  }

  type(text: string, options?: { delay?: number | undefined; } | undefined): Promise<void> {
    return this._keyboard.type(text, options);
  }

  input(text: string): Promise<void> {
    return this._keyboard.insertText(text);
  }
}