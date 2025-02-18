import { DataTableRowHandle } from '../UnrealEngine';

export interface SalvageTableRow {
  SalvageDropItems: SalvageTableRowItem[];
  StrippedFromBuild: boolean;
}

export interface SalvageTableRowItem {
  ItemDataTable: DataTableRowHandle;
  QuantityMin: number;
  QuantityMax: number;
  ChanceToDrop: number;
}
