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

      resultRowName:
        row.ItemToCreate_4_842F5059497E898D938220BCCC148B08.RowName,
      resultCount: row.CountToCreate_17_9ACBB85C48DCB6769A2331AB7B56E2C8,

      category: await this.enumsService.getEnumDisplayName(
        row.Category_22_940DB5D6483687DCE5FF63A7711F71C3
      ),

      benchesRequired: await this.parseBenchesRequired(row),

      craftDuration: row.CraftDuration_13_BFC1ED4A429775D36D12E683816868D6,

      // TODO: add missing properties
      // LinkedRecipesToUnlock_28_EAECA1EA4C69C00231A206961B10737D?:
      //   | DataTableRowHandle[]
      //   | null;
      // NotUnlockableByPickup_24_B20B4A1149D919E221126BA38DB0D6C2: boolean;
      // ResearchData_31_461737CF4D96D522FB3DC88C54DA0508: RecipeTableRowResearchData;
      // StatModifier_41_48EF866B4719B527AA6212AD8AC21DFE: DataTableRowHandle;
      // RecipeTags_44_45098727469F09EC03E5F689D36398D8?: string[] | null;
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
    const recipeItems =
      row.RecipeItems_7_0F13BA7A407C72065EE926B9D41B8B9E ?? [];

    // Find all allowed items in each slot
    const substitutesPerSlots = await Promise.all(
      recipeItems.map(async (recipeItem) => {
        if (
          recipeItem.Item_5_5AD3D6B1470ED45BCB2D15BC84BB0F1A.DataTable
            .ObjectName !== "DataTable'ItemTable_RecipeSubstitutes'"
        ) {
          // Recipe slot is simple, no substitute
          return [
            {
              itemRowName:
                recipeItem.Item_5_5AD3D6B1470ED45BCB2D15BC84BB0F1A.RowName,
              itemCount: recipeItem.Count_6_4C6C5BFB4956F9C29A5C2BB6F28B7690,
            },
          ];
        }

        const substitutesRow =
          await this.dataTablesService.getRow<SubstitutesTableRow>(
            recipeItem.Item_5_5AD3D6B1470ED45BCB2D15BC84BB0F1A
          );
        if (!substitutesRow) {
          throw new Error('Substitute table not found!');
        }

        return substitutesRow.ItemsOfType_13_69D0C1FA45B0F782D1A86B8576E0473C.map(
          (entry) => ({
            itemRowName: entry.RowName,
            itemCount: recipeItem.Count_6_4C6C5BFB4956F9C29A5C2BB6F28B7690,
          })
        );
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
    const benchesRequired =
      row.BenchesRequired_10_493C635841D8143BB87BDCA941CD28A6 ?? [];
    return benchesRequired.map((entry) => entry.RowName);
  }
}
