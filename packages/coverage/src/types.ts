export interface CoverageOptions {
  include?: string | string[];
  exclude?: string | string[];
  extension?: string | string[];
  cwd?: string;
  outputDir?: string;
  enabled?: boolean;
}
