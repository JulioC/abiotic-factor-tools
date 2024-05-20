import _ from 'lodash';
import { injectable } from 'tsyringe';
import { ParsedRecipe, RecipesParserService } from '../Parsers';
import { ItemsParserService, ParsedItem } from '../Parsers/Items';
import { BaseExporter } from './BaseExporter';
import { WIKI_ITEM_NAME_OVERRIDES } from './constants';

function formatNumber(n: number) {
  return n !== 0 ? n : undefined;
}

@injectable()
export class WikiRecipesExporter extends BaseExporter {
  protected parsedRecipes: ParsedRecipe[] = [];
  protected parsedItems: ParsedItem[] = [];
  protected parsedItemsMap: Record<string, ParsedItem> = {};

  constructor(
    protected itemsParserService: ItemsParserService,
    protected recipesParserService: RecipesParserService
  ) {
    super();
  }

  protected override async warmUp() {
    this.parsedRecipes = await this.recipesParserService.getParsedRecipes();
    this.parsedItems = await this.itemsParserService.getParsedItems();

    this.parsedItemsMap = _.keyBy(this.parsedItems, 'rowName');
  }

  protected getName() {
    return 'Recipes';
  }

  protected async getData() {
    const recipes = this.parsedRecipes.map((parsedRecipe) =>
      this.formatRecipe(parsedRecipe)
    );
    return recipes;
    // return _.keyBy(recipes, 'rowName');
  }

  protected formatRecipe(parsedRecipe: ParsedRecipe) {
    return {
      rowName: parsedRecipe.rowName,

      resultItem: this.formatResultItem(parsedRecipe),
      resultAmount: formatNumber(parsedRecipe.resultCount),

      requiredStation: this.formatRequiredStation(parsedRecipe),

      craftDuration: formatNumber(parsedRecipe.craftDuration),

      ingredients: this.formatIngredients(parsedRecipe),
    };
  }

  protected formatItemName(parsedItem: ParsedItem) {
    const override = WIKI_ITEM_NAME_OVERRIDES[parsedItem.rowName];
    const name = override ?? parsedItem.name;
    return name.replace(/"/g, '').replace(/ & /g, ' and ').replace(/&/g, '');
  }

  protected formatResultItem(parsedRecipe: ParsedRecipe) {
    const parsedItem = this.parsedItemsMap[parsedRecipe.resultRowName];
    if (!parsedItem) {
      console.log(`Unknown recipe item ${parsedRecipe.resultRowName}`);
      return 'UNKNOWN';
    }
    return this.formatItemName(parsedItem);
  }

  protected formatIngredients(parsedRecipe: ParsedRecipe) {
    return parsedRecipe.ingredients.map((ingredient) => {
      const parsedItem = this.parsedItemsMap[ingredient.itemRowName];
      if (!parsedItem) {
        console.log(`Unknown recipe item ${parsedRecipe.resultRowName}`);
        return {
          ingredientItem: 'UNKNOWN',
          amount: formatNumber(ingredient.itemCount),
        };
      }
      return {
        ingredientItem: this.formatItemName(parsedItem),
        amount: formatNumber(ingredient.itemCount),
      };
    });
  }

  protected formatRequiredStation(parsedRecipe: ParsedRecipe) {
    if (parsedRecipe.benchesRequired.length > 1) {
      console.log(
        `Recipe ${parsedRecipe.rowName} has multiple benchesRequired!`
      );
    }

    const benchRequired = parsedRecipe.benchesRequired[0];
    if (!benchRequired) {
      return undefined;
    }

    const parsedItem = this.parsedItemsMap[benchRequired];
    if (!parsedItem) {
      console.log(`Unknown recipe item ${parsedRecipe.resultRowName}`);
      return undefined;
    }

    return this.formatItemName(parsedItem);
  }
}
