import type { UrlWithStringQuery } from 'node:url';
export interface ImportItem {
  path: string;
  onlyImportDefault: boolean;
}

export interface RequireItem {
  path: string;
}

export interface DynamicImportItem {
  path: string;
}

export interface ExportItem {
  name: string;
}
export interface FileInfo {
  type: 'file';
  filename: string;
}

export interface PackageJSONExportsField {
  [key: string]: PackageJSONExportsField | string;
}

export interface PackageJSON {
  name: string;
  version: string;
  main?: string;
  module?: string;
  type?: 'module';
  exports?: PackageJSONExportsField;
}

export interface PackageInfo {
  type: 'package';
  dir: string;
  entry: string;
  packageJSON: PackageJSON;
}

export interface ServerMiddleware {
  (ctx: ServerContext, next: () => (Promise<void> | void)): Promise<void> | void;
}

export interface ServerContext {
  body: any;
  setHeader(name: string, value: number | string | ReadonlyArray<string>): void;
  request: {
    url: UrlWithStringQuery;
  }
}

export interface ServerOptions {
  cwd: string;
};
