import { injectable } from 'tsyringe';
import { ObjectsService } from './ObjectsService';
import { StringsService } from './StringsService';
import { EnumBlueprintEntry } from './types';

export async function getEnumLabel(value?: string) {
  if (!value) return;
}

@injectable()
export class EnumsService {
  constructor(
    protected objectsService: ObjectsService,
    protected stringsService: StringsService
  ) {}

  async getEnumDisplayName(value: string): Promise<string> {
    const { name, key } = this.parseEnumValue(value);

    const enumObject = await this.getEnumObject(name);
    const displayNameEntry = enumObject.Properties?.DisplayNameMap.find(
      (entry) => !!entry[key]
    );

    const handle = displayNameEntry?.[key];
    if (!handle) {
      throw new Error(`DisplayNameEntry not found for enum ${value}`);
    }

    const displayName = await this.stringsService.getString(handle);
    if (!displayName) {
      throw new Error(`DisplayName not found for enum ${value}`);
    }

    return displayName;
  }

  protected parseEnumValue(value: string) {
    const [name, key] = value.split('::');
    if (!name || !key) {
      throw new Error(`Invalid enum ${value}`);
    }
    return { name, key };
  }

  protected async getEnumObject(name: string) {
    const enumObject = await this.objectsService.getObject<EnumBlueprintEntry>({
      ObjectName: name,
      ObjectPath: `/Game/Blueprints/Data/${name}.0`,
    });
    return enumObject;
  }
}
