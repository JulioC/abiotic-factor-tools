import { injectable } from 'tsyringe';
import { ObjectsService } from './ObjectsService';
import {
  DataTableBlueprintEntry,
  DataTableRowHandle,
  ObjectIdentifier,
} from './types';

@injectable()
export class DataTablesService {
  constructor(protected objectsService: ObjectsService) {}

  async getRow<RowDataType>(rowHandle: DataTableRowHandle) {
    if (rowHandle.RowName === 'None') {
      return undefined;
    }

    const dataTable = await this.getDataTableObject<RowDataType>(
      rowHandle.DataTable
    );
    return dataTable.Rows[rowHandle.RowName];
  }

  async getAllRows<RowDataType>(identifier: ObjectIdentifier) {
    const dataTable = await this.getDataTableObject<RowDataType>(identifier);
    return dataTable.Rows;
  }

  protected async getDataTableObject<RowDataType>(
    identifier: ObjectIdentifier
  ) {
    const dataTable = await this.objectsService.getObject<
      DataTableBlueprintEntry<RowDataType>
    >(identifier);
    return dataTable;
  }
}
