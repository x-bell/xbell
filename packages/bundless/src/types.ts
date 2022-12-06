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
