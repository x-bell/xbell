import { EventEmitter } from 'node:events';
import type {
  BrowserContext as BrowserContextInterface,
  BrowserContextDependencies,
  Target,
} from './types';

export class BrowserContext extends EventEmitter implements BrowserContextInterface {
  // #connection: Connection;
  // #browser: Browser;
  #id?: string;

  /**
   * @internal
   */
  constructor(protected _deps: BrowserContextDependencies, contextId?: string) {
    super();
    this.#id = contextId;
  }

  /**
   * An array of all active targets inside the browser context.
   */
  // targets(): Target[] {
  //   return this._deps.browser.targets().filter(target => {
  //     return target.browserContext === this;
  //   });
  // }

  /**
   * This searches for a target in this specific browser context.
   *
   * @example
   * An example of finding a target for a page opened via `window.open`:
   *
   * ```ts
   * await page.evaluate(() => window.open('https://www.example.com/'));
   * const newWindowTarget = await browserContext.waitForTarget(
   *   target => target.url() === 'https://www.example.com/'
   * );
   * ```
   *
   * @param predicate - A function to be run for every target
   * @param options - An object of options. Accepts a timout,
   * which is the maximum wait time in milliseconds.
   * Pass `0` to disable the timeout. Defaults to 30 seconds.
   * @returns Promise which resolves to the first target found
   * that matches the `predicate` function.
   */
  waitForTarget(
    predicate: (x: Target) => boolean | Promise<boolean>,
    options: {timeout?: number} = {}
  ): Promise<Target> {
    return this.#browser.waitForTarget(target => {
      return target.browserContext() === this && predicate(target);
    }, options);
  }

  /**
   * An array of all pages inside the browser context.
   *
   * @returns Promise which resolves to an array of all open pages.
   * Non visible pages, such as `"background_page"`, will not be listed here.
   * You can find them using {@link Target.page | the target page}.
   */
  async pages(): Promise<Page[]> {
    const pages = await Promise.all(
      this.targets()
        .filter(target => {
          return (
            target.type() === 'page' ||
            (target.type() === 'other' &&
              this.#browser._getIsPageTargetCallback()?.(
                target._getTargetInfo()
              ))
          );
        })
        .map(target => {
          return target.page();
        })
    );
    return pages.filter((page): page is Page => {
      return !!page;
    });
  }

  /**
   * Returns whether BrowserContext is incognito.
   * The default browser context is the only non-incognito browser context.
   *
   * @remarks
   * The default browser context cannot be closed.
   */
  isIncognito(): boolean {
    return !!this.#id;
  }

  /**
   * @example
   *
   * ```ts
   * const context = browser.defaultBrowserContext();
   * await context.overridePermissions('https://html5demos.com', [
   *   'geolocation',
   * ]);
   * ```
   *
   * @param origin - The origin to grant permissions to, e.g. "https://example.com".
   * @param permissions - An array of permissions to grant.
   * All permissions that are not listed here will be automatically denied.
   */
  async overridePermissions(
    origin: string,
    permissions: Permission[]
  ): Promise<void> {
    const protocolPermissions = permissions.map(permission => {
      const protocolPermission =
        WEB_PERMISSION_TO_PROTOCOL_PERMISSION.get(permission);
      if (!protocolPermission) {
        throw new Error('Unknown permission: ' + permission);
      }
      return protocolPermission;
    });
    await this.#connection.send('Browser.grantPermissions', {
      origin,
      browserContextId: this.#id || undefined,
      permissions: protocolPermissions,
    });
  }

  /**
   * Clears all permission overrides for the browser context.
   *
   * @example
   *
   * ```ts
   * const context = browser.defaultBrowserContext();
   * context.overridePermissions('https://example.com', ['clipboard-read']);
   * // do stuff ..
   * context.clearPermissionOverrides();
   * ```
   */
  async clearPermissionOverrides(): Promise<void> {
    await this.#connection.send('Browser.resetPermissions', {
      browserContextId: this.#id || undefined,
    });
  }

  /**
   * Creates a new page in the browser context.
   */
  async newPage(): Promise<Page> {
    // TODO:
   
    // return this.#browser._createPageInContext(this.#id);
  }

  /**
   * The browser this browser context belongs to.
   */
  browser(): Browser {
    return this.#browser;
  }

  /**
   * Closes the browser context. All the targets that belong to the browser context
   * will be closed.
   *
   * @remarks
   * Only incognito browser contexts can be closed.
   */
  async close(): Promise<void> {
    assert(this.#id, 'Non-incognito profiles cannot be closed!');
    await this.#browser._disposeContext(this.#id);
  }
}
