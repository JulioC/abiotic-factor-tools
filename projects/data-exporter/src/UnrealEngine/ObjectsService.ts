import fs from 'fs/promises';
import path from 'path';
import { inject, injectable } from 'tsyringe';
import { ObjectIdentifier } from './types';

export const TOKEN_OBJECTS_BASE_PATH = 'OBJECTS_BASE_PATH';

@injectable()
export class ObjectsService {
  protected objectCache = new Map<string, Record<string, unknown>>();

  constructor(@inject(TOKEN_OBJECTS_BASE_PATH) protected basePath: string) {}

  async getObject<T>(identifier: ObjectIdentifier): Promise<T> {
    const { filename, key } = this.parseObjectPath(identifier.ObjectPath);

    if (!this.objectCache.has(filename)) {
      const contents = await fs.readFile(filename, 'utf-8');
      const parsed = JSON.parse(contents);
      this.objectCache.set(filename, parsed);
    }

    const cached = this.objectCache.get(filename);
    const objectValue = cached?.[key] as T | undefined;
    if (!objectValue) {
      throw new Error(`Object "${key}" not found in ${filename}`);
    }

    return objectValue;
  }

  async getBinaryObject(objectPath: string, extension: string) {
    const { filename } = this.parseObjectPath(objectPath, extension);
    const buffer = await fs.readFile(filename);
    return buffer;
  }

  parseObjectPath(objectPath: string, extension = 'json') {
    const pattern = /\/Game\/([^.]*)\.([\w_]+)/;
    const result = pattern.exec(objectPath);
    if (!result) {
      throw new Error(`Failed to parse ObjectPath: ${objectPath}`);
    }

    const [, relativePath = '', key = ''] = result;

    const filename = path.join(this.basePath, `${relativePath}.${extension}`);

    return { filename, key };
  }
}
