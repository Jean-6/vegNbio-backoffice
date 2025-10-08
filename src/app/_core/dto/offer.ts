import {Approval} from './approval';


export interface Offer {
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
