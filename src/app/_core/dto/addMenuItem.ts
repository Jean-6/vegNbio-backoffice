


export interface AddMenuItem{

  itemType: string;
  canteenId: string;
  name: string;
  desc: string;
  price: number;
  volume?: string,
  isGaseous?: boolean,
  isAlcoholic?: boolean,

  ingredients?:string [],
  allergens? : string[],
  userId: string;
}
