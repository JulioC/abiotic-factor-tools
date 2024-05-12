import { DataTableRowHandle } from '../UnrealEngine';

export interface RecipeTableRow {
  ItemToCreate_4_842F5059497E898D938220BCCC148B08: DataTableRowHandle;
  CountToCreate_17_9ACBB85C48DCB6769A2331AB7B56E2C8: number;
  Category_22_940DB5D6483687DCE5FF63A7711F71C3: string;
  RecipeItems_7_0F13BA7A407C72065EE926B9D41B8B9E?: RecipeTableRowItems[] | null;
  BenchesRequired_10_493C635841D8143BB87BDCA941CD28A6?:
    | DataTableRowHandle[]
    | null;
  CraftDuration_13_BFC1ED4A429775D36D12E683816868D6: number;
  LinkedRecipesToUnlock_28_EAECA1EA4C69C00231A206961B10737D?:
    | DataTableRowHandle[]
    | null;
  NotUnlockableByPickup_24_B20B4A1149D919E221126BA38DB0D6C2: boolean;
  ResearchData_31_461737CF4D96D522FB3DC88C54DA0508: RecipeTableRowResearchData;
  StatModifier_41_48EF866B4719B527AA6212AD8AC21DFE: DataTableRowHandle;
  RecipeTags_44_45098727469F09EC03E5F689D36398D8?: string[] | null;
  StrippedFromBuild_46_61BC23684470C1F8417C2CB501AE385D: boolean;
}

export interface RecipeTableRowItems {
  Item_5_5AD3D6B1470ED45BCB2D15BC84BB0F1A: DataTableRowHandle;
  Count_6_4C6C5BFB4956F9C29A5C2BB6F28B7690: number;
}

export interface RecipeTableRowResearchData {
  MinigameDifficulty_2_3171D2E345E11B59D973DCB6B2880F80: string;
  FakeItems_8_C6B7FD58466979569022C192F2D44E24?: DataTableRowHandle[] | null;
}
