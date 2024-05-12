import { DataTableRowHandle } from '../UnrealEngine';

export interface SalvageTableRow {
  SalvageDropItems_4_6F67F05F401125FAC788E4B1800CBC93: SalvageTableRowItem[];
  StrippedFromBuild_6_38AC6B25462173D72BAEEEBA0D85380A: boolean;
}

export interface SalvageTableRowItem {
  ItemDataTable_16_C430AEEE4D16DC471206DBBAA9F6796F: DataTableRowHandle;
  QuantityMin_13_08A3850648D7ADA008D57FB0855F1474: number;
  QuantityMax_14_6E8D8DF64637C2DD2E9DA59CBF7FAADF: number;
  ChanceToDrop_12_45BEC64444296AFBC69AD280F4D2BEDB: number;
}
