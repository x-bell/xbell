import enhancedResolve from 'enhanced-resolve';
import * as fs from 'node:fs';

const { CachedInputFileSystem, ResolverFactory } = enhancedResolve;

const resolver = ResolverFactory.createResolver({
  extensions: ['.js', '.ts', '.jsx','.tsx', '.json'],
  fileSystem: new CachedInputFileSystem(fs),
  conditionNames: ['default'],
  preferRelative: true,
  resolveToContext: true,
});

export function resolve(path: string, importer: string): Promise<{
  filepath: string;
  request: any;
}> {
  return new Promise((r, j) => {
    resolver.resolve({}, importer, path, {}, (err, filepath, request) => {
      if (err || !filepath) j(err);
      else r({
        filepath,
        request
      });
    })
  })
}

