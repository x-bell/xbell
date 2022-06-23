import { MultiEnvData } from 'xbell';

export type Account = {
  username: string;
  password: string;
};

// 声明一个账号（多环境）
export const adminAccount: MultiEnvData<Account> = {
  dev: {
    username: 'dev_xbell_admin',
    password: 'password123',

  },
  prod: {
    username: 'xbell_admin',
    password: 'password123',
  }
};

// 声明多个账号（多环境）
export const memberAccounts: MultiEnvData<Account[]> = {
  dev: [
    {
      username: 'dev_pikachu',
      password: 'pikachu123',
    },
    {
      username: 'dev_psyduck',
      password: 'psyduck123',
  
    },
    {
      username: 'dev_super_mario',
      password: 'super_mario123',
    },
  ],
  prod: [
    {
      username: 'pikachu',
      password: 'pikachu123',
    },
    {
      username: 'psyduck',
      password: 'psyduck123',
  
    },
    {
      username: 'super_mario',
      password: 'super_mario123',
    },
  ]
};
