import { XBellConfig, Browser } from 'xbell';

// login & save browser context
function saveBrowserCotnext(stateFile: string) {
  return async () => {
    const browser = await Browser.launch();
    const page = await browser.newPage();
    await page.context().storageState({ path: stateFile });
    await browser.close();
  }
}

const statePaths = {
  dev: '.test/dev-state.json',
  prod: '.test/prod-state.json',
}

const config: XBellConfig = {
  projects: [
    {
      name: 'dev',
      config: {
        setup: saveBrowserCotnext(statePaths.dev),
        browser: {
          storageState: statePaths.dev,
        }
      },
      data: {
        origin: 'https://example.com'
      }
    },
    {
      name: 'prod',
      config: {
        setup: saveBrowserCotnext(statePaths.prod),
        browser: {
          storageState: statePaths.prod,
        }
      },
      data: {
        origin: 'https://example.com',
      }
    }
  ]
}

export default config;
