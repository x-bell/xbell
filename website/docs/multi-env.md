---
sidebar_position: 2
---

# 多环境测试
一般企业场景中，都会有多套数据环境，在未上线前用的是 `dev`，准备上线时用的是预发 `pre`，正式上线后是 `prod`。以这 3 环境为例，配置一套自己公司专用的环境。

```typescript title="environment.d.ts"
interface EnvConfig {
    // 声明 3 个环境
    ENV: 'dev' | 'pre' | 'prod';
    // 自定义一个环境变量
    SITE_ORIGIN: string;
}
```

```typescript title="xbell.config.ts"
import type { XBellConfig } from 'xbell';

export default {
  // 此处省略其它配置...

  // 项目未上线，先在两个环境中运行，上线后再加 prod
  runEnvs: ['dev', 'pre'],
  // 在 envConfig 中配置环境变量
  envConfig: {
    dev: {
      ENV: 'dev',
      SITE_ORIGIN: 'https://dev.github.com',
    },
    pre: {
      ENV: 'pre',
      SITE_ORIGIN: 'https://pre.github.com'
    },
    prod: {
      ENV: 'prod',
      SITE_ORIGIN: 'https://github.com'
    },
  }
} as XBellConfig;
```

```typescript
import { Group, Case, Inject, Context } from 'xbell';

@Group('演示分组')
export class MultiEnvTestGroup {
  @Inject()
  ctx: Context;

  // 由于 xbell.config 中，runEnvs 声明了两个环境
  // 因此该 case 会运行两次，两次为不同环境
  @Case('多环境测试')
  async testMultiEnv() {
    const { page, envConfig } = this.ctx;
    await page.goto(envConfig.SITE_ORIGIN);
    // code...
  }
}

```