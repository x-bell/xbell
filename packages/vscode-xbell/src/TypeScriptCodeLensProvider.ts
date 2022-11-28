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
import { ICase, parseCases } from './ast';
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
    const cases = parseCases(tsCode);
    const lenses = this.makeLens(cases, document);
    return lenses;
  }

  private makeLens(cases: ICase[], document: TextDocument) {
    const codeLenses: CodeLens[] = [];
    cases.forEach((c) => {
      const caseRange = this.makeRange(c, document);
      codeLenses.push(new CodeLens(caseRange, {
        title: 'Debug',
        command: 'extension.debugCase',
        arguments: [
          genCaseConfig({
            fileName: basename(document.fileName),
          })
        ]
      }));
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
