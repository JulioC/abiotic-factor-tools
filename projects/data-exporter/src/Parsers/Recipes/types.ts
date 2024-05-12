export type ParsedRecipe = {
  rowName: string;

  resultRowName: string;
  resultCount: number;

  category: string;

  ingredients: ParsedRecipeIngredient[];
  benchesRequired: string[];

  craftDuration: number;
};

export type ParsedRecipeIngredient = {
  itemRowName: string;
  itemCount: number;
};
