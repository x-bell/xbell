import { MultiEnvData } from 'xbell';

export type Parsing = {
  taskName: string;
  picName: string;
  type: string;
  tag: string;
  view: string;
  spuId: string;
};

// 图片解析任务相关信息配置
export const parsingTask: MultiEnvData<Parsing> = {
  fat: {
    taskName: 'L321W153连衣裙新',
    picName: 'L321W153-01G8_01.jpg',
    type: '模特图',
    tag: '构图标签',
    view: '中景',
    spuId: 'L221U098'
  }
};
