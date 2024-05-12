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
      this.cachedRecipes = await Promise.all(
        Object.entries(rows).map(([rowName, row]) =>
          this.recipeRowParser.parse(rowName, row)
        )
      );
    }

    return this.cachedRecipes;
  }

  protected getRecipeRows() {
    return this.dataTableService.getAllRows<RecipeTableRow>({
      ObjectName: 'ItemTable_Global',
      ObjectPath: '/Game/Blueprints/DataTables/DT_Recipes.0',
    });
  }
}
