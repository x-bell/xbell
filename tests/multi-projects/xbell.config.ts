import type { XBellConfig } from 'xbell';

const config: XBellConfig = {
  browser: {
    headless: false,
  },
  projects: [
    {
      name: 'project1',
    },
    {
      name: 'project2',
    },
    {
      name: 'project3',
    },
    {
      name: 'project4',
    },
    {
      name: 'project5',
    },
    // {
    //   name: 'project6',
    // },
    // {
    //   name: 'project7',
    // },
    // {
    //   name: 'project8',
    // },
    // {
    //   name: 'project9',
    // },
    // {
    //   name: 'project10',
    // }
  ],
  coverage: {
    enabled: true,
    exclude: ['**/add.ts']
  }
}

export default config;
