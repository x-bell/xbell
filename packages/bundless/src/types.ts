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

export interface PackageInfo {
  type: 'package';
  dir: string;
  entry: string;
  packageJSON: object;
}

export interface PackageJSON {
  name: string;
  version: string;
  main?: string;
  module?: string;
  type?: 'module';
  exports?: Record<string, any>;
}
