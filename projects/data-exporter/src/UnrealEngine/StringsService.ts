import { injectable } from 'tsyringe';
import { ObjectsService } from './ObjectsService';
import {
  ObjectIdentifier,
  StringHandle,
  StringTableBlueprintEntry,
} from './types';

@injectable()
export class StringsService {
  constructor(protected objectsService: ObjectsService) {}

  async getString(handle: StringHandle) {
    let stringFromTable: string | undefined;
    if ('TableId' in handle) {
      const stringTable = await this.getStringTableObject(handle.TableId);
      stringFromTable = stringTable.StringTable.KeysToMetaData[handle.Key];
    }

    let localizationString: string | undefined;
    if ('SourceString' in handle) {
      localizationString = handle.SourceString;
    }

    let cultureInvariantString: string | undefined;
    if ('CultureInvariantString' in handle) {
      cultureInvariantString = handle.CultureInvariantString ?? undefined;
    }

    return (
      stringFromTable ??
      localizationString ??
      cultureInvariantString ??
      undefined
    );
  }

  async getAllStrings(tableId: string) {
    const stringTable = await this.getStringTableObject(tableId);
    return stringTable.StringTable.KeysToMetaData;
  }

  protected async getStringTableObject(tableId: string) {
    const pattern = /([^.]+)\.([^.]+)/;
    const result = pattern.exec(tableId);
    if (!result) {
      throw new Error(`Failed to parse string table`);
    }

    const [, objectPath, objectName] = result;

    // This logic assumes StringTables files always contain a single table
    const identifier: ObjectIdentifier = {
      ObjectName: objectName ?? '',
      ObjectPath: `${objectPath}.0`,
    };

    const stringTable =
      await this.objectsService.getObject<StringTableBlueprintEntry>(
        identifier
      );

    // Asserts the our assumptions
    if (objectName !== stringTable.Name) {
      throw new Error(
        `StringTable object has incorrect name: ${stringTable.Name} (expected ${objectName})`
      );
    }

    return stringTable;
  }
}
