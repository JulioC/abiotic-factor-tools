import { injectable } from 'tsyringe';
import { RecipeTableRow, SubstitutesTableRow } from '../../Game';
import {
  DataTablesService,
  EnumsService,
  StringsService,
} from '../../UnrealEngine';
import { ParsedRecipe, ParsedRecipeIngredient } from './types';

@injectable()
export class RecipeRowParserService {
  constructor(
    protected stringsService: StringsService,
    protected enumsService: EnumsService,
    protected dataTablesService: DataTablesService
  ) {}

  async parse(rowName: string, row: RecipeTableRow): Promise<ParsedRecipe[]> {
    const parsedRecipes = [];

    const partialRecipe = {
      rowName,

      resultRowName: row.ItemToCreate.RowName,
      resultCount: row.CountToCreate,

      category: await this.enumsService.getEnumDisplayName(row.Category),

      benchesRequired: await this.parseBenchesRequired(row),

      craftDuration: row.CraftDuration,

      // TODO: add missing properties
      // LinkedRecipesToUnlock?:
      //   | DataTableRowHandle[]
      //   | null;
      // NotUnlockableByPickup: boolean;
      // ResearchData: RecipeTableRowResearchData;
      // StatModifier: DataTableRowHandle;
      // RecipeTags?: string[] | null;
    } satisfies Partial<ParsedRecipe>;

    const ingredientsCombinations = await this.parseIngredientsCombinations(
      row
    );
    for (const ingredients of ingredientsCombinations) {
      parsedRecipes.push({
        ...partialRecipe,
        ingredients,
      });
    }

    return parsedRecipes;
  }

  async parseIngredientsCombinations(row: RecipeTableRow) {
    const recipeItems = row.RecipeItems ?? [];

    // Find all allowed items in each slot
    const substitutesPerSlots = await Promise.all(
      recipeItems.map(async (recipeItem) => {
        if (
          recipeItem.Item.DataTable.ObjectName !==
          "DataTable'ItemTable_RecipeSubstitutes'"
        ) {
          // Recipe slot is simple, no substitute
          return [
            {
              itemRowName: recipeItem.Item.RowName,
              itemCount: recipeItem.Count,
            },
          ];
        }

        const substitutesRow =
          await this.dataTablesService.getRow<SubstitutesTableRow>(
            recipeItem.Item
          );
        if (!substitutesRow) {
          throw new Error('Substitute table not found!');
        }

        return substitutesRow.ItemsOfType.map((entry) => ({
          itemRowName: entry.RowName,
          itemCount: recipeItem.Count,
        }));
      })
    );

    // Combine each possible item in each slot with each other
    let combinations: ParsedRecipeIngredient[][] = [[]];
    for (
      let slotIndex = 0;
      slotIndex < substitutesPerSlots.length;
      ++slotIndex
    ) {
      const nextCombinations: ParsedRecipeIngredient[][] = [];
      const allSubstitutesInSlot = substitutesPerSlots[slotIndex] ?? [];
      for (const substituteInSlot of allSubstitutesInSlot) {
        for (const previous of combinations) {
          nextCombinations.push([...previous, substituteInSlot]);
        }
      }
      combinations = nextCombinations;
    }

    return combinations;
  }

  async parseBenchesRequired(row: RecipeTableRow) {
    const benchesRequired = row.BenchesRequired ?? [];
    return benchesRequired.map((entry) => entry.RowName);
  }
}
