import 'reflect-metadata'

export function genPropertyDecorator(metadataKey: string | symbol): () => PropertyDecorator {
  return () => (target, propertyKey) => {
      const keys: Array<string | symbol> = Reflect.getMetadata(metadataKey, target) || []
      keys.push(propertyKey)
      Reflect.defineMetadata(metadataKey, keys, target)
  };
}

export function getMetadataKeys(key: string | symbol, target: Object): Array<string | symbol> {
  return Reflect.getMetadata(key, target) || []
}
