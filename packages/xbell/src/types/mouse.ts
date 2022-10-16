export interface Mouse {
  click(x: number, y: number, options?: {
    /**
     * Defaults to `left`.
     */
    button?: "left"|"right"|"middle";

    /**
     * defaults to 1. See [UIEvent.detail].
     */
    clickCount?: number;

    /**
     * Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.
     */
    delay?: number;
  }): Promise<void>;

  /**
   * Shortcut for mouse.move(x, y, options?)
   */
  dblclick(x: number, y: number, options?: {
    /**
     * Defaults to `left`.
     */
    button?: "left"|"right"|"middle";

    /**
     * Time to wait between `mousedown` and `mouseup` in milliseconds. Defaults to 0.
     */
    delay?: number;
  }): Promise<void>;

  /**
   * Dispatches a `mousedown` event.
   * @param options
   */
  down(options?: {
    /**
     * Defaults to `left`.
     */
    button?: "left"|"right"|"middle";

    /**
     * defaults to 1. See [UIEvent.detail].
     */
    clickCount?: number;
  }): Promise<void>;

  /**
   * Dispatches a `mousemove` event.
   * @param x
   * @param y
   * @param options
   */
  move(x: number, y: number, options?: {
    /**
     * Defaults to 1. Sends intermediate `mousemove` events.
     */
    steps?: number;
  }): Promise<void>;

  /**
   * Dispatches a `mouseup` event.
   * @param options
   */
  up(options?: {
    /**
     * Defaults to `left`.
     */
    button?: "left"|"right"|"middle";

    /**
     * defaults to 1. See [UIEvent.detail].
     */
    clickCount?: number;
  }): Promise<void>;

  /**
   * Dispatches a `wheel` event.
   */
  wheel(deltaX: number, deltaY: number): Promise<void>;
}
