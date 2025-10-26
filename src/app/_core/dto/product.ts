import {Approval} from './canteen';

export class ProductFilter {

  name?: string ;
  categories?: string[] ;
  types?: string[] ;
  allergens?: string[] ;
  startDateAdded?: Date ;
  endDateAdded?: Date ;
  status?: string ;
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


