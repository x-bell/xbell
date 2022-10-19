import type { XBellConfig } from 'xbell';
import viteConfig from './vite.config';

const config: XBellConfig = {
  browser: {
    devServer: {
      viteConfig,
    }
  },
  hooks: {
    async beforeEach({ page }) {
      await page.goto('https://github.com', {
        html: '<div id="app"></div>'
      });
    }
  },
  // projects: [
  //   {
  //     name: 'local-fat',
  //     config: {
  //       include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
  //       hooks: {
  //         async beforeEach({ page }) {
  //           // 方式1: 使用 xbell 域名mock + devServer 能力
  //           await page.goto('https://github.com', {
  //             html: '<div id="app"></div>'
  //           });
  //           // 方式2：使用项目自身 devServer
  //           // viteServer.preview()
  //           // await page.goto('http://localhost:8888');
  //         }
  //       }
  //     }
  //   },
  //   {
  //     name: 'local-stage',
  //     config: {
  //       include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
  //       hooks: {
  //         async beforeEach({ page }) {
  //           // 方式1: 使用 xbell 域名mock + devServer 能力
  //           await page.goto('https://github.com', {
  //             html: '<div id="app"></div>'
  //           });
  //           // 方式2：使用项目自身 devServer
  //           // viteServer.preview()
  //           // await page.goto('http://localhost:8888');
  //         }
  //       }
  //     }
  //   },
  //   {
  //     name: 'local-prod',
  //     config: {
  //       include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
  //       hooks: {
  //         async beforeEach({ page }) {
  //           // 方式1: 使用 xbell 域名mock + devServer 能力
  //           await page.goto('https://github.com', {
  //             html: '<div id="app"></div>'
  //           });
  //           // 方式2：使用项目自身 devServer
  //           // viteServer.preview()
  //           // await page.goto('http://localhost:8888');
  //         }
  //       }
  //     }
  //   },
  //   {
  //     name: 'fat',
  //     config: {
  //       include: ['e2e/**/*.{test,spec}.{js,ts,tsx}']
  //     }
  //   },
  //   {
  //     name: 'stage',
  //     config: {
  //       include: ['e2e/**/*.{test,spec}.{js,ts,tsx}']
  //     }
  //   },
  //   {
  //     name: 'prod',
  //     config: {
  //       include: ['e2e/**/*.{test,spec}.{js,ts,tsx}']
  //     }
  //   }
  // ]
}

export default config;
