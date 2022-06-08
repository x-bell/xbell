import {
  CodeLens,
  CodeLensProvider,
  EventEmitter,
  Event,
  CancellationToken,
  ProviderResult,
  TextDocument,
  Range
} from 'vscode';
import { IGroup, parseGroups } from './ast';
import { genCaseConfig } from './debugConfig';
import { basename } from 'path';

// const astCache = new Map<string, { text: string, ast: ParseResult<File> }>();

export class TypeScriptCodeLensProvider implements CodeLensProvider {
  constructor(
    private _onDidChange: EventEmitter<void>,
  ) {}

  get onDidChangeCodeLenses(): Event<void> {
    return this._onDidChange.event;
  }

  public provideCodeLenses(document: TextDocument, token: CancellationToken): ProviderResult<CodeLens[]> {
    const tsCode = document.getText();
    const groups = parseGroups(tsCode);
    const lenses = this.makeLens(groups, document);
    return lenses;
  }

  private makeLens(groups: IGroup[], document: TextDocument) {
    const codeLenses: CodeLens[] = [];
    groups.forEach((group) => {
      const groupRange = this.makeRange(group, document);
      codeLenses.push(new CodeLens(groupRange, {
        title: '调试',
        command: 'extension.debugCase',
        arguments: [
          genCaseConfig({
            fileName: basename(document.fileName),
            groupName: group.groupName,
          })
        ]
      }));
      group.cases.forEach((c) => {
        const caseRange = this.makeRange(c, document);
        codeLenses.push(new CodeLens(caseRange, {
          title: '调试',
          command: 'extension.debugCase',
          arguments: [
            genCaseConfig({
              fileName: basename(document.fileName),
              groupName: group.groupName,
              caseName: c.caseName,
            })
          ]
        }));
      });
    });
    return codeLenses;
  }

  private makeRange({ startIndex, endIndex }: { startIndex: number, endIndex: number }, document: TextDocument) {
    const start = document.positionAt(startIndex);
    const end = document.positionAt(endIndex);
    const range = new Range(start, end);
    return range;
  }
}
