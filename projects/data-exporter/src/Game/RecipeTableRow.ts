import { DataTableRowHandle } from '../UnrealEngine';

export interface RecipeTableRow {
  ItemToCreate: DataTableRowHandle;
  CountToCreate: number;
  Category: string;
  RecipeItems?: RecipeTableRowItems[] | null;
  BenchesRequired?: DataTableRowHandle[] | null;
  CraftDuration: number;
  LinkedRecipesToUnlock?: DataTableRowHandle[] | null;
  NotUnlockableByPickup: boolean;
  ResearchData: RecipeTableRowResearchData;
  StatModifier: DataTableRowHandle;
  RecipeTags?: string[] | null;
  StrippedFromBuild: boolean;
}

export interface RecipeTableRowItems {
  Item: DataTableRowHandle;
  Count: number;
}

export interface RecipeTableRowResearchData {
  MinigameDifficulty: string;
  FakeItems?: DataTableRowHandle[] | null;
}
