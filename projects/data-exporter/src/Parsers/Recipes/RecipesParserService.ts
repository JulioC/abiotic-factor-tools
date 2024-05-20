import { injectable } from 'tsyringe';
import { RecipeTableRow } from '../../Game';
import { DataTablesService } from '../../UnrealEngine';
import { RecipeRowParserService } from './RecipeRowParserService';
import { ParsedRecipe } from './types';

@injectable()
export class RecipesParserService {
  protected cachedRecipes: ParsedRecipe[] | undefined;

  constructor(
    protected dataTableService: DataTablesService,
    protected recipeRowParser: RecipeRowParserService
  ) {}

  async getParsedRecipes() {
    if (!this.cachedRecipes) {
      const rows = await this.getRecipeRows();
      const recipesNestedArray = await Promise.all(
        Object.entries(rows).map(([rowName, row]) =>
          this.recipeRowParser.parse(rowName, row)
        )
      );
      this.cachedRecipes = recipesNestedArray.flat();
    }

    return this.cachedRecipes;
  }

  protected async getRecipeRows() {
    const itemRecipeRows =
      await this.dataTableService.getAllRows<RecipeTableRow>({
        ObjectName: 'ItemTable_Global',
        ObjectPath: '/Game/Blueprints/DataTables/DT_Recipes.0',
      });
    // TODO: include soups, but add a flag to them?
    // const soupRecipeRows =
    //   await this.dataTableService.getAllRows<RecipeTableRow>({
    //     ObjectName: 'ItemTable_Global',
    //     ObjectPath: '/Game/Blueprints/DataTables/DT_SoupRecipes.0',
    //   });
    return {
      ...itemRecipeRows,
      //  ...soupRecipeRows
    };
  }
}
