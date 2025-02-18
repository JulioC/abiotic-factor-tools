import { AssetHandle, DataTableRowHandle, StringHandle } from '../UnrealEngine';

export interface SubstitutesTableRow {
  ItemTypeName: StringHandle;
  ItemTypeIcon: AssetHandle;
  ItemTypeDescription: StringHandle;
  ItemsOfType: DataTableRowHandle[];
}
