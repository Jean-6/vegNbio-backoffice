
export type MenuItemType = 'drink' | 'dessert' | 'meal' | 'appetizer';

export interface MenuItem {
  type: MenuItemType;
  name: string;
  desc?: string;
  price: number;
  pictures?: string[];
  tags?: string[];
  foodType: string;
}


export interface Drink extends MenuItem {
  type: 'drink';
  volume: string; // ex: '33cl'
  alcohol: number; // ex: 0 ou 12.5
  carbonated: boolean;
}


export interface Dessert extends MenuItem {
  type: 'dessert';
  vegan?: boolean;
  sucreAjoute?: boolean;
  allergens?: string[];
}

export interface Meal extends MenuItem {
  type: 'meal';
  ingredients: string[];
  portion?: string; // ex: '300g'
  allergens?: string[];
  typeCuisine?: string; // ex: 'italienne'
}

export interface Appetizer extends MenuItem {
  type: 'appetizer';
  ingredients: string[];
  allergens?: string[];
  accompaniment?: string; // ex: "pain", "crudités"
}
