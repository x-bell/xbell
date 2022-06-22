import type { QuestionCollection } from 'inquirer';
import { getGitConfig } from './utils';

export type BellAnswers = {
  author: string
  projectName: string
  template: string
}

export function getQuestion(options: Partial<BellAnswers>): QuestionCollection<BellAnswers> {
  return [
    {
      type: 'input',
      name: 'projectName',
      message: '项目名称',
      default: options.projectName
    },
    {
      type: 'input',
      name: 'author',
      message: '作者名称',
      default: getGitConfig().userName,
    },
    {
      type: 'list',
      name: 'template',
      message: '模板',
      choices: [
        {
          name: '基础模板',
          value: 'basic',
        },
        {
          name: '实用模板',
          value: 'complex',
        },
      ]
    },
  ];
}

