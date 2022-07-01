<div align="center">
  <img
    height="250"
    width="250"
    alt="xbell"
    src="https://raw.githubusercontent.com/x-bell/xbell-assets/main/logo/xbell-logo.svg"
  />
<h2>一款舒适的自动化测试框架</h2>

</div>

## 文档
[XBell 站点](https://x-bell.github.io/xbell/)
## 特性
- 基于 playwright 的异步测试框架
- 基于 TypeScript 提供多功能装饰器
- 多套数据环境支持

## 快速开始
```bash
# 初始化一个项目
$ npm create xbell
# 进入项目
$ cd <your-project-name>
# 安装浏览器（需要等待些时间）
$ npm run install:browser
# 运行用例
$ npm run start
```

## TDOO
- [ ] html 测试报告
- [ ] 生成 bug/videos，用于bug回放和协同
- [ ] 快照确认 - 当快照出现 diff 时，命令行提示是否确认更新

## 常用装饰器
|  装饰器   | 类型  | 描述 |  例子| 已支持
|  ----  | ----  | --- | --- | ---
| @Group  | Class | 测试分组 | @Group('登录测试') | ✅
| @RunEnvs  | Class/Method | 用例只在某环境运行：当功能未上线时，指定仅在某环境测试 | @RunEnvs(['fat']) | ✅
| @RunBrowsers | Class/Method | 指定用例运行的环境 | @RunBrowsers(['webkit', 'chromium']) | TODO
| @Inject | Property | 注入 | @Inject() \n ctx: Context; |  ✅
| @Case | Method | 测试用例声明 | @Case('登录成功') | ✅
| @Depend | Method | 用例依赖  | 待补充 | ✅
| @Data | Parameter | 多环境数据 | @Data({ dev: 'devData', prod: 'prodData' }) | ✅
| @BatchData | Method | 批量数据 | 待补充 | ✅
| @Fixture | Method | 待补充(可参考 palywright - fixture) | 待补充 | TODO
| @BeforeEachCase | Method | 每个用例执行前将运行的逻辑 | 待补充 | ✅
| @AfterEachCase | Method | 每个用例执行完将运行的方法 | 待补充 | ✅
| @Data.Param | Parameter | 多环境数据 - 注入的参数 | 待补充 | ✅
| @BatchData.Param | Parameter | 批量数据- 注入的参数 | 待补充 | ✅
| @Fixture.Param | Parameter | 批量数据- 注入的参数 | 待补充 | TODO

## 断言
|  装饰器   | 类型  | 描述 |  例子| 已支持
|  ----  | ----  | --- | --- | ---
| @Expect.NoPageError  | Method | 断言页面无报错 | @Expect.NoPageError() | ✅
| @Expect.ToMatchSnapshot  | Method | 首次运行则生成快照，第二次运行将对比之前快照 | @ToMatchSnapshot() | TODO

## 非常用装饰器
|  装饰器   | 类型  | 描述 | 例子 | 已支持
|  ----  | ----  | --- | --- | ---
| @Only | Class/Method | 仅运行该用例 | @Only() | TODO
| @Skip | Class/Method | 运行时跳过该用例 | @Skip() | TODO
| @Fixme | Class/Method | 类似 Skip，区别在于：在测试报告中打上 Fixme，代表开发未修复 | @Fixme() | TODO
| @Timeout() | Class/Method | 指定用例的异步超时时间, 例如接口较慢的页面可设置长时间 timeout，单位 ms | @Timeout(30000) | TODO
| @Slow | Class/Method | 等价 @Timeout(60000) | @Slow() | TODO
| @Fast | Class/Method | 等价 @Timeout(5000) | @Fast() |  TODO