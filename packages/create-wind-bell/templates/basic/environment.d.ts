import 'xbell';

declare module 'xbell' {
    // 声明环境变量类型
    interface EnvConfig {
        // 增加一个 QYDS_ORIGIN 的变量，类型为 string
        // 接着在 xbell.config.ts 中 envConfig 配置即可
        QYDS_ORIGIN: string
    }
}
