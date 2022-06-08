import type { QuestionCollection } from 'inquirer';
import { getGitConfig } from './utils';

export type BellAnswers = {
  author: string
  projectName: string
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
  ];
}

