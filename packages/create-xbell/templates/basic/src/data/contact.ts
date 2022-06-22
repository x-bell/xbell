import { MultiEnvData } from 'xbell';

export type Contact = {
  name: string;
};

export const contacts: MultiEnvData<Contact[]> = {
  dev: [
    { name: 'dev_可达鸭' },
    { name: 'dev_小火龙' },
    { name: 'dev_马里奥' },
  ],
  prod: [
    { name: '可达鸭'},
    { name: '小火龙'},
    { name: '马里奥'},
  ]
};

