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
      .filter(([, row]) => row.CookableData.CanBeCooked)
      .map<ParsedItemCookableStates>(([rowName, row]) => ({
        rawItemRowName: rowName,
        cookedItemRowName: row.CookableData.CookedItem.RowName,
        burnedItemRowName: row.CookableData.BurnedItem.RowName,
      }));

    return {
      ..._.keyBy(cookableStateEntries, 'rawItemRowName'),
      ..._.keyBy(cookableStateEntries, 'cookedItemRowName'),
      ..._.keyBy(cookableStateEntries, 'burnedItemRowName'),
    };
  }
}
