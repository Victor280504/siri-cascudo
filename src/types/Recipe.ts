import { Ingredient } from "./Ingredient";

export type Recipe = {
  idProduct: number;
  idIngredient: number;
  quantity: number;
};

export type RecipeWithIngredient = {
  idProduct: number;
  ingredient: Ingredient;
  quantity: number;
}