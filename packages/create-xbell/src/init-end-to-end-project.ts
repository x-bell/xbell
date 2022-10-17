import { Command } from 'commander';
import { Answers, prompt } from 'inquirer'
import { glob } from 'glob';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as nunjucks from 'nunjucks';
import { execSync } from 'child_process';
import { getQuestion, BellAnswers } from './question';
import color from '@xbell/color';

interface IFile {
  relativePath: string;
  content: string;
}

function genFiles(rootDir: string, answer: BellAnswers): Promise<IFile[]> {
  const templatePath = path.join(rootDir, answer.template);
  return new Promise((resolve, reject) => {
    glob('**/*', {
      cwd: templatePath,
      dot: true
    }, (error, files) => {
      if (error) {
        reject(error)
        return;
      }

      const templateFiles = files.map(filepath => {
        const absolutePath = path.join(
          templatePath,
          filepath,
        )
        const stat = fs.statSync(absolutePath)
        if (stat.isDirectory()) {
          return false;
        }

        const templateContent = fs.readFileSync(
          absolutePath,
          'utf-8'
        )

        const content = path.extname(filepath) === '.njk'
          ? nunjucks.renderString(templateContent, answer)
          : templateContent
        return {
          content,
          relativePath: filepath.replace(/.njk$/, '')
        }
      })
      .filter(Boolean) as IFile[];
      
      resolve(templateFiles);
    })
  })
}

export function writeFiles(anwsers: BellAnswers, templateFiles: IFile[]) {
  templateFiles.forEach(templateFile => {
    const absoluteFilepath = path.join(
      process.cwd(),
      anwsers.projectName,
      templateFile.relativePath
    );
    fs.ensureFileSync(absoluteFilepath);
    fs.writeFileSync(absoluteFilepath, templateFile.content);
  })
}

function installPackages(projectName: string) {
  const COMMAND = 'npm';
  const args = [ 'install' ];
  const projectPath = path.join(
    process.cwd(),
    projectName,
  );

  // const spinner = ora('正安装依赖...').start();

  execSync(`${COMMAND} ${args.join(' ')}`, {
    cwd: projectPath || process.cwd(),
  })

  // spinner.stop()

  console.log(color.bgGreen.black(' Done ') + ' ' + color.green('项目初始化完成!'))
  console.log(
    color.cyan(`cd ${projectName}`)
  )
  console.log(
    color.cyan(`npm run install:browser`)
  )

}

export async function initEndToEndProject() {
  const templatePath = path.join(__dirname, '../templates');
  const program = new Command().parse(process.argv);
  const defaultProjectName = program.args[0] || 'xbell-project';
  const defaultAnswer = {
    projectName: defaultProjectName,
  };
  const question = getQuestion(defaultAnswer);
  const anwser = await prompt(question);
  const files = await genFiles(templatePath, anwser);

  writeFiles(anwser, files);
  installPackages(anwser.projectName);
}
