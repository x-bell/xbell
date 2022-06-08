<div align="center">
  <img
    height="250"
    width="250"
    alt="xbell"
    src="https://hlgcdn.oss-cn-hangzhou.aliyuncs.com/smart-design-dev-images/16544192783182/xbell.svg"
  />
<h2>一款舒适的自动化测试框架</h2>

</div>

## 特性
- 基于 playwright 的异步测试框架
- 基于 TypeScript 提供多功能装饰器
- 多套数据环境支持

## TDOO
- [x] VSCode 插件 - 项目调试 & 单Case运行/debug
- [x] eslint 检测 await 使用
- [x] 脚手架
- [x] 站点
- [ ] @Expect 装饰器
- [ ] 支持Fixture
- [ ] 支持非常用装饰器
- [ ] 测试报告
- [ ] expect 提供 pixelmatch 快照对比
- [ ] 命令行支持 --file --group --case --browser --env --head 参数
- [ ] 生成 bug/videos，用于bug回放和协同
- [ ] 基础模板

## 使用
目前
```bash
$ npm install xbell
$ npx xbell
```
TODO
```bash
$ npm init xbell <project-name>
```

## 常用装饰器
|  装饰器   | 类型  | 描述 |  例子| 已支持
|  ----  | ----  | --- | --- | ---
| @Group  | Class | 测试分组 | @Group('登录测试') | ✅
| @RunEnvs  | Class/Method | 用例只在某环境运行：当功能未上线时，指定仅在某环境测试 | @RunEnvs(['fat']) | TODO
| @RunBrowsers | Class/Method | 指定用例运行的环境 | @RunBrowsers(['webkit', 'chromium']) | TODO
| @Alone (待定) | Class/Method | 想法：各 case 在 group 中共享上下文，若声明 @Alone() 则单独起上下文  | @Alone() | TODO
| @Inject | Property | 注入 | @Inject() \n ctx: Context; |  ✅
| @Case | Method | 测试用例声明 | @Case('登录成功') | ✅
| @Depend | Method | 用例依赖  | 待补充 | ✅
| @BatchData | Method | 批量数据 | 待补充 | ✅
| @Fixture | Method | 待补充(可参考 palywright - fixture) | 待补充 | TODO
| @BeforeEachCase | Method | 每个用例执行前将运行的逻辑 | 待补充 | TODO
| @AfterEachCase | Method | 每个用例执行完将运行的方法 | 待补充 | TODO
| @BatchData.Param | Parameter | 批量数据- 注入的参数 | 待补充 | ✅
| @Fixture.Param | Parameter | 批量数据- 注入的参数 | 待补充 | TODO

## 非常用装饰器
|  装饰器   | 类型  | 描述 | 例子 | 已支持
|  ----  | ----  | --- | --- | ---
| @Only | Class/Method | 仅运行该用例 | @Only() | TODO
| @Skip | Class/Method | 运行时跳过该用例 | @Skip() | TODO
| @Fixme | Class/Method | 类似 Skip，区别在于：在测试报告中打上 Fixme，代表开发未修复 | @Fixme() | TODO
| @Timeout() | Class/Method | 指定用例的异步超时时间, 例如接口较慢的页面可设置长时间 timeout，单位 ms | @Timeout(30000) | TODO
| @Slow | Class/Method | 等价 @Timeout(60000) | @Slow() | TODO
| @Fast | Class/Method | 等价 @Timeout(5000) | @Fast() |  TODO