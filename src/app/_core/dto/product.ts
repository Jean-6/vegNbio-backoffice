import {Approval} from './approval';


export class ProductFilter {

  name?: string ;
  category?: string[] ;
  type?: string[] ;
  allergens?: string[] ;
  startDate?: Date ;
  endDate?: Date ;
  status?: string ;
  origin?:string[]
  supplier?: string ;
}

export interface Product {
  id: string;
  type: string
  name: string;
  desc: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  origin: string;
  expirationDate: string;
  userId: string;
  pictures: string[];
  approval: Approval;
  createdAt: Date;
}


