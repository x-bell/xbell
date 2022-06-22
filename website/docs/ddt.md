---
sidebar_position: 3
---

# 数据驱动测试

在 **多环境测试** 中讲了用例会运行在不同的环境中，如果用例在不同环境时消费的数据各不相同，我们可以配置在 `envConfig` 中作区分。

但如果每个用例都需要大量的数据来测试，那 `envConfig` 会很臃肿，并且难以维护。就像你开发后端应用，我想你肯定不希望把「数据库数据」维护在「环境配置表」里。

## 使用 Data 装饰器
在 XBell 项目中，所需要的“数据库数据“，建议是放在 `data` 目录下，这里以登录账号为例：
```typescript title="src/data/account.ts"
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
```


定义好数据后，如果在测试用例中消费呢？

```typescript title="src/cases/login.test.ts"
import { Group, Data, Inject, Case, Context } from 'xbell';
import { Account, adminAccount } from '../data/account';

@Group('登录分组')
export class LoginTestGroup {

  @Case('账号登录成功')
  @Data(adminAccount) // 注入多套环境的数据，每个环境该 case 都会执行一遍
  async testAdminLoginSuccess(@Data.Param() account: Account) {
    console.log('account', account.uesrname, account.password);
    // ...
  }
}
```

## 测试批量数据
当你要测搜索功能时，你可能不仅仅想测一条数据，而是多条数据都搜索成功，就像这样：
```typescript title="src/cases/search.test.ts"
@Case()
async testMultiData() {
  const data = [
    { name: '可达鸭'},
    { name: '小火龙'},
    { name: '马里奥'},
  ];

  for (let i = 0; i < data.length; i++) {
    // await search(data[i].name);
    // await expect...;
  }
}
```

但你往往还要考虑环境问题，因此你的数据很可能是这样：
```typescript title="src/data/contacts.ts"

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
```

如果继续自己写循环的话，真的还挺麻烦的...
因此我建议你这样：
```typescript title="src/cases/search.test.ts"
@Case('多环境批量搜索')
@BatchData(contacts)
async testBatchData(@BatchData.Param() contact: Contact) {
  // await search(data[i].name);
  // await expect...
}

```