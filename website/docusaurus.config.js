// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'XBell',
  tagline: '一款舒适的自动化测试框架',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/xbell/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'X-Bell', // Usually your GitHub org/user name.
  projectName: 'XBell', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en-US',
    locales: ['en-US', 'zh-CN'],
    localeConfigs: {
      'en-US': {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        // path: 'en',
        calendar: 'gregory',
      },
      'zh-CN': {
        label: '中文',
        direction: 'ltr',
        // path: 'cn',
        htmlLang: 'zh-CN',
      }
    }
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/x-bell/xbell/tree/main/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/x-bell/xbell/tree/main/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'XBell',
        logo: {
          alt: 'My Site Logo',
          src: 'https://raw.githubusercontent.com/x-bell/xbell-assets/main/logo/xbell-logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'get-started',
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'api',
            label: 'API',
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'examples',
            label: 'Examples',
          },
          {
            href: 'https://github.com/x-bell/xbell',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting started',
                to: '/docs/get-started',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Scenario testing',
                // prependBaseUrlToHref: true,
                href: 'https://x-bell.github.io/xbell/test-site/',
                // to: '/xbell/test-site/'
              },
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/xbell',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/x-bell/xbell',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} X-Bell.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
