interface EnvConfig {
    // 声明两个环境 dev 和 prod
    ENV: 'dev' | 'fat' | 'prod';
    // 增加一个环境变量，接着在 xbell.config.ts 中 envConfig 配置即可
    SITE_ORIGIN: string;
}
