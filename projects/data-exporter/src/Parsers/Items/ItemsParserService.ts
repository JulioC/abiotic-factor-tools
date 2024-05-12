import _ from 'lodash';
import { injectable } from 'tsyringe';
import { ItemTableRow } from '../../Game/ItemTableRow';
import { DataTablesService } from '../../UnrealEngine';
import { ItemRowParserService } from './ItemRowParserService';
import { ParsedItemCookableStates } from './types';

@injectable()
export class ItemsParserService {
  constructor(
    protected dataTableService: DataTablesService,
    protected itemRowParser: ItemRowParserService
  ) {}

  async getParsedItems() {
    const itemRows = await this.getItemRows();
    const cookableStatesMap = this.extractCookableStatesMap(itemRows);
    return Promise.all(
      Object.entries(itemRows).map(([rowName, itemRow]) =>
        this.itemRowParser.parse(rowName, itemRow, cookableStatesMap)
      )
    );
  }

  protected getItemRows() {
    return this.dataTableService.getAllRows<ItemTableRow>({
      ObjectName: 'ItemTable_Global',
      ObjectPath: '/Game/Blueprints/Items/ItemTable_Global.0',
    });
  }

  protected extractCookableStatesMap(
    itemRows: Record<string, ItemTableRow>
  ): Record<string, ParsedItemCookableStates> {
    const cookableStateEntries = Object.entries(itemRows)
      .filter(
        ([, row]) =>
          row.CookableData_94_7EFD1F0A4A7EFB44D3D8B9B14581BF36
            .CanBeCooked_1_F8283E94449BB680D9E4D0B6435E50F2
      )
      .map<ParsedItemCookableStates>(([rowName, row]) => ({
        rawItemRowName: rowName,
        cookedItemRowName:
          row.CookableData_94_7EFD1F0A4A7EFB44D3D8B9B14581BF36
            .CookedItem_11_EFC590354E4A63C58C41C3982B38F7DC.RowName,
        burnedItemRowName:
          row.CookableData_94_7EFD1F0A4A7EFB44D3D8B9B14581BF36
            .BurnedItem_19_109C79FE416ADB62B4AC7E893BCD2958.RowName,
      }));

    return {
      ..._.keyBy(cookableStateEntries, 'rawItemRowName'),
      ..._.keyBy(cookableStateEntries, 'cookedItemRowName'),
      ..._.keyBy(cookableStateEntries, 'burnedItemRowName'),
    };
  }
}
