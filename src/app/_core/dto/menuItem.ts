
export type MenuItemType = 'drink' | 'dessert' | 'meal' | 'appetizer';

export interface MenuItem {
  itemType: MenuItemType;
  itemName: string;
  desc?: string;
  price: number;
  pictures?: string[];
  //tags?: string[];
  //foodType: string;
}


export interface Drink extends MenuItem {
  itemType: 'drink';
  volume: string;
  alcoholic: boolean;
  gaseous: boolean;
}


export interface Meal extends MenuItem {
  itemType: 'meal';
  ingredients: string[];
  //portion?: string;
  allergens?: string[];
  typeCuisine?: string; // ex: 'italienne'
}

export class MenuItemFilter {

  itemType?: string;
  itemName ?: string;
  canteenName? : string;
  //allergens?: [];
  minPrice?: number;
  maxPrice?: number;
  //tags?: string[];
  //foodType?: string;
}





export interface AddMenuItem{

  itemType: string;
  canteenId: string;
  itemName: string;
  desc: string;
  price: number;
  volume?: string,
  isGaseous?: boolean,
  isAlcoholic?: boolean,

  ingredients?:string [],
  allergens? : string[],
  userId: string;
}

