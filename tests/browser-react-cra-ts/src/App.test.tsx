
import { test, expect } from 'xbell';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('renders learn react link', async ({ page }) => {
  await page.goto('https://www.gaoding.com', {
    html: '<div id="root"></div>'
  })

  await page.evaluate(async () => {
    
    // const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    // await sleep(5000);
    const { default: React } = await import('react');
    
    const { default: App } = await import('./App');
    const { default: ReactDOM } = await import('react-dom/client');

    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
    );
    root.render(<App />);
  });

  await sleep(115000);
});
