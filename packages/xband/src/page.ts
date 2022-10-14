
import type {
  Page as PageInterface,
  PageFactory as PageFactoryInterface,
  Channel,
  PageDependencies,
  FrameManager
} from './types';

export const PageFactory = <PageFactoryInterface>class Page implements PageInterface {
  static async create(deps: PageDependencies) {
    const page = new Page(deps);
    await page.setup();
    return page;
  }

  protected _frameManager!: FrameManager;
  
  constructor (protected _deps: PageDependencies) {
    const { session, FrameManagerFactory, FrameFactory } = this._deps;
    // TODO:
    // session.on('Page.domContentEventFired', () => {
    //   return this.emit(PageEmittedEvents.DOMContentLoaded);
    // });
    // session.on('Page.domContentEventFired', () => {
    //   return this.emit(PageEmittedEvents.Load);
    // });
    // session.on('Page.loadEventFired', () => {
    //   return this.emit(PageEmittedEvents.Load);
    // });
    // session.on('Runtime.consoleAPICalled', event => {
    //   return this.#onConsoleAPI(event);
    // });
    // session.on('Runtime.bindingCalled', event => {
    //   return this.#onBindingCalled(event);
    // });
    // session.on('Page.javascriptDialogOpening', event => {
    //   return this.#onDialog(event);
    // });
    // session.on('Runtime.exceptionThrown', exception => {
    //   return this.#handleException(exception.exceptionDetails);
    // });
    // session.on('Inspector.targetCrashed', () => {
    //   return this.#onTargetCrashed();
    // });
    // session.on('Performance.metrics', event => {
    //   return this.#emitMetrics(event);
    // });
    // session.on('Log.entryAdded', event => {
    //   return this.#onLogEntryAdded(event);
    // });
    // session.on('Page.fileChooserOpened', event => {
    //   return this.#onFileChooser(event);
    // });
  }

  async setup(): Promise<void> {
    const { session, FrameManagerFactory, FrameFactory } = this._deps;

    this._frameManager = await FrameManagerFactory.create({
      session,
      FrameFactory
    });
    await Promise.all([
      this._deps.session.request('Performance.enable', undefined),
      this._deps.session.request('Log.enable', undefined), 
    ]);
  }

  teardown(): void | Promise<void> {}

  async goto(url: string) {
    await this._frameManager.mainFrame().goto(url);
  }
}
